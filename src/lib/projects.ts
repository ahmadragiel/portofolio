import rawSnapshot from '../data/github.generated.json';
import { projectEnrichment, excludedRepos } from '../data/projects';
import type {
  GithubRepoSnapshot,
  GithubSnapshot,
  Project,
  ProjectCategory,
  ProjectFilterId,
  ProjectVisualTheme,
} from '../types';

/**
 * Merge + normalise the two data sources into the shape the UI consumes.
 *
 *   github.generated.json  -> facts that can go stale (stars, dates, language)
 *   projects.ts            -> narrative that a human writes (description, etc.)
 *
 * The generated snapshot is the single source of truth for anything countable, so
 * the UI can never drift from the real repository state. A repository with no
 * enrichment entry still appears, using its GitHub description and language, so
 * a newly pushed repo shows up automatically on the next sync.
 */

const snapshot = rawSnapshot as unknown as GithubSnapshot;

type RepoWithLive = GithubRepoSnapshot & {
  verifiedLiveUrl?: string | null;
  hasPages?: boolean;
  defaultBranch?: string;
};

const repos = (snapshot.repos ?? []) as RepoWithLive[];

const DEFAULT_VISUAL_THEME: Record<ProjectCategory, ProjectVisualTheme> = {
  'Web Development': 'web',
  'Data Analysis': 'data',
  'Machine Learning': 'vision',
  'Computer Vision': 'vision',
  Academic: 'academic',
  'Tools / Utility': 'neutral',
  Other: 'neutral',
};

function toGithubUrl(name: string): string {
  return `https://github.com/${snapshot.profile.login}/${name}`;
}

function buildSearchIndex(parts: Array<string | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Falls back to the GitHub description so new repos are never blank. */
function fallbackDescription(repo: RepoWithLive): string {
  if (repo.description) return repo.description;
  return 'Repository published on GitHub. No written description is available yet.';
}

function resolveLiveUrl(
  repo: RepoWithLive,
  enrichment: (typeof projectEnrichment)[string] | undefined,
): string | null {
  // An explicit `liveUrl` key in the enrichment layer is an editorial decision
  // and wins, including when it is `null` ("verified: no live demo").
  if (enrichment && 'liveUrl' in enrichment) {
    return enrichment.liveUrl ?? null;
  }
  // Otherwise fall back to the URL the sync script actually resolved with 200.
  return repo.verifiedLiveUrl ?? null;
}

function toProject(repo: RepoWithLive): Project {
  const enrichment = projectEnrichment[repo.name];
  const category: ProjectCategory = enrichment?.category ?? 'Other';

  const technologies = enrichment?.technologies ?? (repo.language ? [repo.language] : []);
  const topics = repo.topics ?? [];

  return {
    id: repo.name,
    name: repo.name,
    title: enrichment?.title ?? repo.name,
    description: enrichment?.description ?? fallbackDescription(repo),
    problem: enrichment?.problem ?? '',
    solution: enrichment?.solution ?? '',
    category,
    secondaryCategories: enrichment?.secondaryCategories,
    technologies,
    features: enrichment?.features ?? [],
    githubUrl: toGithubUrl(repo.name),
    liveUrl: resolveLiveUrl(repo, enrichment),
    homepage: repo.homepage ?? null,
    featured: enrichment?.featured === true,
    academic: enrichment?.academic === true,
    language: repo.language,
    stars: repo.stars,
    forks: repo.forks,
    createdAt: repo.createdAt,
    updatedAt: repo.updatedAt,
    image: enrichment?.image ?? null,
    visualTheme: enrichment?.visualTheme ?? DEFAULT_VISUAL_THEME[category],
    searchIndex: buildSearchIndex([
      repo.name,
      enrichment?.title,
      enrichment?.description,
      enrichment?.problem,
      enrichment?.solution,
      category,
      enrichment?.secondaryCategories?.join(' '),
      technologies.join(' '),
      topics.join(' '),
      repo.language,
      enrichment?.features.join(' '),
    ]),
  };
}

/** Every public repository, minus the explicit exclusions. */
export const allProjects: Project[] = repos
  .filter((repo) => !excludedRepos[repo.name])
  .map(toProject)
  .sort((a, b) => {
    if (a.updatedAt !== b.updatedAt) return (a.updatedAt ?? '') < (b.updatedAt ?? '') ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

/** Hand-picked highlights. No ranking, no scoring, no ordering claim. */
export const featuredProjects: Project[] = allProjects.filter((project) => project.featured);

/** Most recently updated repositories, used by the GitHub Activity section. */
export const recentProjects: Project[] = allProjects
  .filter((project) => project.updatedAt)
  .slice(0, 6);

export const githubProfile = snapshot.profile;
export const githubFetchedAt = snapshot.fetchedAt;

/** Counters shown in the GitHub Activity section. All derived, never hardcoded. */
export const githubStats = {
  publicRepositories: githubProfile.publicRepos,
  listedRepositories: allProjects.length,
  followers: githubProfile.followers,
  following: githubProfile.following,
  totalStars: allProjects.reduce((sum, project) => sum + project.stars, 0),
  totalForks: allProjects.reduce((sum, project) => sum + project.forks, 0),
  liveDemos: allProjects.filter((project) => project.liveUrl).length,
  accountCreatedAt: githubProfile.createdAt,
  profileUrl: githubProfile.htmlUrl,
  /** ISO timestamp of the last successful sync. */
  fetchedAt: githubFetchedAt,
  hasSnapshot: allProjects.length > 0,
} as const;

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------
export function matchesFilter(project: Project, filter: ProjectFilterId): boolean {
  switch (filter) {
    case 'all':
      return true;
    case 'web':
      return project.category === 'Web Development';
    case 'data':
      return (
        project.category === 'Data Analysis' || project.category === 'Machine Learning'
      );
    case 'vision':
      return project.category === 'Computer Vision';
    case 'academic':
      return project.academic || project.category === 'Academic';
    case 'other':
      return (
        project.category === 'Other' ||
        project.category === 'Tools / Utility'
      );
    default:
      return true;
  }
}

export function matchesQuery(project: Project, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  // Every whitespace-separated term must appear somewhere in the project.
  return needle
    .split(/\s+/)
    .every((term) => project.searchIndex.includes(term));
}

/** Category label -> number of projects, for the filter chip counters. */
export function countByFilter(projects: Project[]): Record<ProjectFilterId, number> {
  return {
    all: projects.length,
    web: projects.filter((p) => matchesFilter(p, 'web')).length,
    data: projects.filter((p) => matchesFilter(p, 'data')).length,
    vision: projects.filter((p) => matchesFilter(p, 'vision')).length,
    academic: projects.filter((p) => matchesFilter(p, 'academic')).length,
    other: projects.filter((p) => matchesFilter(p, 'other')).length,
  };
}
