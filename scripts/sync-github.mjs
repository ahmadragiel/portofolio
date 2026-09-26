#!/usr/bin/env node
/**
 * GitHub -> Normalized Project Data pipeline.
 *
 *   GitHub API
 *      -> repository metadata (profile + every public repository)
 *      -> verified live-demo detection
 *      -> src/data/github.generated.json
 *      -> merged with src/data/projects.ts at build time
 *
 * Design rules
 *  - The frontend never calls the GitHub API. This script runs at dev/build time.
 *  - The generated file is committed, so a failed or rate-limited sync can never
 *    blank out the portfolio; the previous snapshot stays in place.
 *  - Enrichment in src/data/projects.ts is never touched by this script.
 *
 * Usage
 *   npm run sync:github
 *   npm run sync:github -- --user someotheruser
 *   GITHUB_TOKEN=ghp_xxx npm run sync:github      # optional, raises the rate limit
 *   npm run sync:github -- --no-live-check        # skip the Pages HTTP probe
 */

import { writeFile, readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'github.generated.json');

const API = 'https://api.github.com';
const DEFAULT_USER = 'ahmadragiel';
const REQUEST_DELAY_MS = 120;
const LIVE_CHECK_TIMEOUT_MS = 12_000;

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name, fallback) => {
  const index = argv.indexOf(`--${name}`);
  return index !== -1 && argv[index + 1] ? argv[index + 1] : fallback;
};

const USERNAME = value('user', DEFAULT_USER);
const CHECK_LIVE = !flag('no-live-check');
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'ahmadragiel-portfolio-sync',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let requestCount = 0;
async function api(pathname) {
  requestCount += 1;
  const url = `${API}${pathname}`;
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });

  if (response.status === 403 || response.status === 429) {
    const remaining = response.headers.get('x-ratelimit-remaining');
    const reset = response.headers.get('x-ratelimit-reset');
    throw new Error(
      `GitHub API rate limit reached (remaining=${remaining}, resets at epoch ${reset}). ` +
        'Set GITHUB_TOKEN to raise the limit. The previous snapshot is left untouched.',
    );
  }
  if (response.status === 404) {
    throw new Error(`Not found: ${pathname}. Check the username.`);
  }
  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status} for ${pathname}`);
  }
  return response.json();
}

/** Follows redirects and returns the final status code, or null on any failure. */
async function probeUrl(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(LIVE_CHECK_TIMEOUT_MS),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-sync)' },
    });
    // Consume a little of the body so the connection can be released cleanly.
    if (response.body) await response.body.cancel();
    return response.status;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
async function fetchProfile() {
  console.log(`> Fetching profile for "${USERNAME}"`);
  const user = await api(`/users/${USERNAME}`);
  return {
    login: user.login,
    name: user.name,
    location: user.location,
    bio: user.bio,
    avatarUrl: user.avatar_url,
    htmlUrl: user.html_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

async function fetchAllRepos() {
  console.log('> Fetching every public repository (paginated)');
  const repos = [];
  const perPage = 100;
  let page = 1;

  for (;;) {
    const batch = await api(
      `/users/${USERNAME}/repos?per_page=${perPage}&page=${page}&type=owner&sort=updated`,
    );
    if (!Array.isArray(batch) || batch.length === 0) break;

    repos.push(...batch);
    console.log(`  page ${page}: ${batch.length} repositories`);

    if (batch.length < perPage) break;
    page += 1;
    await sleep(REQUEST_DELAY_MS);
  }

  console.log(`  total: ${repos.length} public repositories`);
  return repos;
}

function normaliseRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    language: repo.language,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.subscribers_count ?? repo.watchers_count,
    openIssues: repo.open_issues_count,
    size: repo.size,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at ?? repo.updated_at,
    homepage: repo.homepage && repo.homepage.trim() ? repo.homepage.trim() : null,
    htmlUrl: repo.html_url,
    fork: repo.fork === true,
    archived: repo.archived === true,
    hasPages: repo.has_pages === true,
    defaultBranch: repo.default_branch,
    license: repo.license ? repo.license.spdx_id : null,
    hasReadme: true,
  };
}

/**
 * A live demo is only recorded when GitHub reports Pages is enabled AND the
 * public URL actually resolves with HTTP 200. Anything else stays null so no
 * dead "Live Demo" button is ever rendered.
 */
async function attachVerifiedLiveUrls(repos) {
  if (!CHECK_LIVE) {
    console.log('> Skipping live demo verification (--no-live-check)');
    for (const repo of repos) repo.verifiedLiveUrl = null;
    return;
  }

  console.log('> Verifying live demo URLs (GitHub Pages)');
  for (const repo of repos) {
    repo.verifiedLiveUrl = null;
    if (!repo.hasPages || repo.fork || repo.archived) continue;

    const candidate = `https://${USERNAME}.github.io/${repo.name}/`;
    const status = await probeUrl(candidate);
    if (status === 200) {
      repo.verifiedLiveUrl = candidate;
      console.log(`  live   ${repo.name} -> ${candidate}`);
    } else {
      console.log(`  no     ${repo.name} (HTTP ${status ?? 'unreachable'})`);
    }
    await sleep(REQUEST_DELAY_MS);
  }
}

function serialise(repos) {
  // Deterministic order: most recently pushed first, then alphabetical.
  return [...repos].sort((a, b) => {
    if (a.pushedAt !== b.pushedAt) return a.pushedAt < b.pushedAt ? 1 : -1;
    return a.name.localeCompare(b.name);
  });
}

async function writeSnapshot(profile, repos) {
  const snapshot = {
    fetchedAt: new Date().toISOString(),
    generator: 'scripts/sync-github.mjs',
    source: `${API}/users/${USERNAME}`,
    liveDemoVerification: CHECK_LIVE,
    profile,
    repos: serialise(repos),
  };

  const contents = `${JSON.stringify(snapshot, null, 2)}\n`;
  await writeFile(OUTPUT_FILE, contents, 'utf8');

  const stars = repos.reduce((sum, repo) => sum + repo.stars, 0);
  console.log('');
  console.log(`✓ Wrote ${path.relative(PROJECT_ROOT, OUTPUT_FILE)}`);
  console.log(`  fetched at      : ${snapshot.fetchedAt}`);
  console.log(`  public repos    : ${profile.publicRepos}`);
  console.log(`  repos captured  : ${repos.length}`);
  console.log(`  total stars     : ${stars}`);
  console.log(`  followers       : ${profile.followers}`);
  console.log(`  following       : ${profile.following}`);
  console.log(`  live demos found: ${repos.filter((r) => r.verifiedLiveUrl).length}`);
}

async function reportFailure(error) {
  console.error('');
  console.error('✗ Sync failed:', error.message);

  // Never destroy a working snapshot on failure.
  try {
    await access(OUTPUT_FILE, constants.F_OK);
    const previous = JSON.parse(await readFile(OUTPUT_FILE, 'utf8'));
    console.error('');
    console.error('  The previous snapshot is still in place, so the site keeps working:');
    console.error(`    fetched at : ${previous.fetchedAt}`);
    console.error(`    repos      : ${previous.repos.length}`);
  } catch {
    console.error('');
    console.error('  No previous snapshot found. The site will render empty states.');
  }

  process.exitCode = 1;
}

async function main() {
  console.log('GitHub sync');
  console.log(`  user         : ${USERNAME}`);
  console.log(`  token        : ${TOKEN ? 'provided' : 'none (unauthenticated)'}`);
  console.log(`  live check   : ${CHECK_LIVE ? 'on' : 'off'}`);
  console.log('');

  try {
    const profile = await fetchProfile();
    const rawRepos = await fetchAllRepos();

    // Forks and archived repos are not this person's own work.
    const ownRepos = rawRepos.filter((repo) => !repo.fork);
    const skippedForks = rawRepos.length - ownRepos.length;
    if (skippedForks > 0) {
      console.log(`  skipped ${skippedForks} forked repositories`);
    }

    const repos = ownRepos.map(normaliseRepo);
    await attachVerifiedLiveUrls(repos);
    await writeSnapshot(profile, repos);

    console.log('');
    console.log(`Done in ${requestCount} API requests.`);
  } catch (error) {
    await reportFailure(error);
  }
}

main();
