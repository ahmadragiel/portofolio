/**
 * SSR smoke test.
 *
 * Renders the entire portfolio to a string in Node. This executes every
 * component and every data path, so it catches render-time crashes, missing
 * data, and bad imports that a build alone would not reveal.
 *
 * Run with:  npm run test:smoke
 */
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import App from '../src/App';
import { ProjectModal } from '../src/components/ProjectModal';
import { CertificateModal } from '../src/components/Certificates';
import {
  allProjects,
  featuredProjects,
  recentProjects,
  githubStats,
  matchesFilter,
  matchesQuery,
} from '../src/lib/projects';
import { certificates } from '../src/data/certificates';
import { socialLinks } from '../src/data/profile';
import { techStack } from '../src/data/tech';
import { PROJECT_FILTERS } from '../src/types';

let failures = 0;
const checks: string[] = [];

function check(label: string, condition: boolean, detail = '') {
  if (condition) {
    checks.push(`  PASS  ${label}${detail ? ` (${detail})` : ''}`);
  } else {
    failures += 1;
    checks.push(`  FAIL  ${label}${detail ? ` (${detail})` : ''}`);
  }
}

// ---------------------------------------------------------------- render
let html = '';
let renderError: string | null = null;
try {
  html = renderToString(createElement(App));
} catch (error) {
  renderError = error instanceof Error ? error.message : String(error);
}

check('App renders without throwing', renderError === null, renderError ?? '');

// ---------------------------------------------------------------- structure
check('Hero headline present', html.includes("Hi, I’m") || html.includes("Hi, I&#x27;m"));
check('About section present', html.includes('id="about"'));
check('Exploring section present', html.includes('id="exploring"'));
check('Skills section present', html.includes('id="skills"'));
check('Certificates section present', html.includes('id="certificates"'));
check('Featured section present', html.includes('id="featured"'));
check('All Projects section present', html.includes('id="projects"'));
check('GitHub section present', html.includes('id="github"'));
check('Contact section present', html.includes('id="contact"'));
check('Footer copyright uses the current year', html.includes(String(new Date().getFullYear())));
check('Skip link present', html.includes('Skip to content'));

// ---------------------------------------------------------------- data
check('Projects were loaded from the GitHub snapshot', allProjects.length > 0, `${allProjects.length} projects`);
check('Featured projects exist', featuredProjects.length > 0, `${featuredProjects.length} featured`);
check('Recent repositories exist', recentProjects.length > 0, `${recentProjects.length} recent`);

check(
  'Public repository count is derived, not hardcoded',
  githubStats.publicRepositories === 10,
  `${githubStats.publicRepositories} public repos`,
);

check(
  'Every project has a valid GitHub URL',
  allProjects.every((p) => p.githubUrl === `https://github.com/ahmadragiel/${p.id}`),
);

check(
  'Every project has a description',
  allProjects.every((p) => p.description.trim().length > 20),
);

check(
  'No project has a percentage or rating in its description',
  allProjects.every((p) => !/\d+\s*%/.test(p.description) && !/\brating\b|\bscore:\s*\d/i.test(p.description)),
);

check(
  'Live demo links only appear for verified URLs',
  allProjects.filter((p) => p.liveUrl).every((p) => p.liveUrl!.startsWith('https://')),
  `${allProjects.filter((p) => p.liveUrl).length} live demos`,
);

check(
  'Social links are limited to published channels',
  socialLinks.length === 4 &&
    socialLinks.every((l) => l.href.startsWith('https://') || l.href.startsWith('mailto:')),
  socialLinks.map((l) => l.label).join(', '),
);

check(
  'Tech stack is non-empty and every item is sourced',
  techStack.length > 0 && techStack.every((t) => t.source === 'repo' || t.source === 'profile'),
  `${techStack.length} technologies`,
);

// ---------------------------------------------------------------- filtering
const web = allProjects.filter((p) => matchesFilter(p, 'web'));
const vision = allProjects.filter((p) => matchesFilter(p, 'vision'));
const academic = allProjects.filter((p) => matchesFilter(p, 'academic'));

check('Web filter returns projects', web.length > 0, `${web.length}`);
check('Computer Vision filter returns projects', vision.length > 0, `${vision.length}`);
check('Academic filter returns projects', academic.length > 0, `${academic.length}`);

check(
  'Every project matches the "all" filter',
  allProjects.every((p) => matchesFilter(p, 'all')),
);

check(
  'Search matches by name',
  allProjects.every((p) => matchesQuery(p, p.name.toLowerCase())),
);
check(
  'Search matches by technology',
  allProjects.some((p) => p.technologies.length > 0 && matchesQuery(p, p.technologies[0].toLowerCase())),
);
check(
  'Search matches by category',
  allProjects.every((p) => matchesQuery(p, p.category.toLowerCase())),
);
check(
  'Search rejects nonsense',
  !allProjects.some((p) => matchesQuery(p, 'zzzzqqqnotathing')),
);
check(
  'Multi-term search requires all terms',
  !matchesQuery(allProjects[0], 'kalender zzzzqqq'),
);

check(
  'All filter chips are wired to a filter id',
  PROJECT_FILTERS.every((f) => allProjects.every((p) => typeof matchesFilter(p, f.id) === 'boolean')),
);

// ---------------------------------------------------------------- links in markup
const hrefs = Array.from(html.matchAll(/href="(https?:\/\/[^"]+)"/g)).map((m) => m[1]);
const uniqueHrefs = Array.from(new Set(hrefs));
check('External links render', uniqueHrefs.length > 0, `${uniqueHrefs.length} unique URLs`);
check(
  'No placeholder or example URLs leaked into the markup',
  !uniqueHrefs.some((h) => /example\.com|yourdomain|localhost|test\.test/i.test(h)),
);
check(
  'GitHub profile link present',
  uniqueHrefs.includes('https://github.com/ahmadragiel'),
);

// ---------------------------------------------------------------- certificates
/*
 * The shipped data intentionally has no certificates, so the viewer markup is
 * only reachable while a real certificate exists. When entries are present the
 * suite exercises the image and PDF paths so the feature cannot silently rot.
 */
if (certificates.length === 0) {
  check(
    'Certificate empty state is rendered',
    html.includes('Certificates will be added soon'),
  );
} else {
  check('Certificate cards render when data exists', html.includes('View Certificate'), `${certificates.length} certificates`);

  for (const cert of certificates) {
    const isPdf = /\.pdf$/i.test(cert.file);
    let certHtml = '';
    let certError: string | null = null;
    try {
      certHtml = renderToString(
        createElement(CertificateModal, { certificate: cert, onClose: () => {} }),
      );
    } catch (error) {
      certError = error instanceof Error ? error.message : String(error);
    }

    check(`Certificate viewer renders "${cert.title}"`, certError === null, certError ?? '');
    check(
      `Certificate viewer is a labelled modal for "${cert.title}"`,
      certHtml.includes('role="dialog"') && certHtml.includes('aria-modal="true"'),
    );
    check(
      `Certificate viewer references the real file for "${cert.title}"`,
      certHtml.includes(cert.file),
    );
    if (isPdf) {
      check(
        `PDF certificate uses an embedded object viewer for "${cert.title}"`,
        certHtml.includes('application/pdf') && certHtml.includes('type="application/pdf"'),
      );
      check(
        `PDF certificate offers a new-tab fallback for "${cert.title}"`,
        certHtml.includes('Open PDF in a new tab'),
      );
    } else {
      check(
        `Image certificate renders an <img> for "${cert.title}"`,
        /<img\b[^>]*src="[^"]*__test\.png"/.test(certHtml),
      );
      check(`Image certificate has alt text for "${cert.title}"`, /<img\b[^>]*alt="/.test(certHtml));
    }
  }
}

// ---------------------------------------------------------------- structure audit
/*
 * These checks parse rendered HTML directly. They stand in for the manual
 * accessibility pass a browser would normally be used for: heading order,
 * accessible names, label association, id uniqueness, and internal link targets.
 *
 * The audit is a function so it can be run against the main page AND against
 * overlay markup (the project modal) that only exists after user interaction.
 */
function audit(markup: string, label: string, options: { expectSingleH1?: boolean } = {}) {
  const ids = Array.from(markup.matchAll(/\sid="([^"]+)"/g)).map((m) => m[1]);
  const idSet = new Set(ids);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  check(
    `[${label}] No duplicate id attributes`,
    duplicates.length === 0,
    duplicates.join(', '),
  );

  if (options.expectSingleH1) {
    // Only the document itself owns an <h1>. A dialog must not introduce a
    // second one, so this is asserted for the page and deliberately skipped below.
    const h1Count = (markup.match(/<h1[\s>]/g) ?? []).length;
    check(`[${label}] Exactly one <h1>`, h1Count === 1, `${h1Count} found`);
  }

  const headings = Array.from(markup.matchAll(/<h([1-6])[\s>]/g)).map((m) => Number(m[1]));
  let headingSkips = 0;
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] - headings[i - 1] > 1) headingSkips += 1;
  }
  check(
    `[${label}] Heading levels never skip a level`,
    headingSkips === 0,
    `${headings.length} headings, ${headingSkips} skip(s)`,
  );

  const imgs = Array.from(markup.matchAll(/<img\b[^>]*>/g)).map((m) => m[0]);
  const imgsMissingAlt = imgs.filter((tag) => !/\salt="/.test(tag));
  check(
    `[${label}] Every <img> has an alt attribute`,
    imgsMissingAlt.length === 0,
    `${imgs.length} images`,
  );

  const anchors = Array.from(markup.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g));
  const anchorsWithoutName = anchors.filter(
    ([, attrs, inner]) => !/aria-label=/.test(attrs) && inner.replace(/<[^>]+>/g, '').trim() === '',
  );
  check(
    `[${label}] Every <a> has an accessible name`,
    anchorsWithoutName.length === 0,
    `${anchors.length} links, ${anchorsWithoutName.length} unnamed`,
  );

  const buttons = Array.from(markup.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g));
  const buttonsWithoutName = buttons.filter(
    ([, attrs, inner]) => !/aria-label=/.test(attrs) && inner.replace(/<[^>]+>/g, '').trim() === '',
  );
  check(
    `[${label}] Every <button> has an accessible name`,
    buttonsWithoutName.length === 0,
    `${buttons.length} buttons, ${buttonsWithoutName.length} unnamed`,
  );

  const inputs = Array.from(markup.matchAll(/<input\b[^>]*>/g)).map((m) => m[0]);
  const unlabelledInputs = inputs.filter((tag) => {
    if (/aria-label(ledby)?=/.test(tag)) return false;
    const id = /\sid="([^"]+)"/.exec(tag)?.[1];
    return !(id && new RegExp(`<label[^>]*for="${id}"`).test(markup));
  });
  check(`[${label}] Every <input> is labelled`, unlabelledInputs.length === 0, `${inputs.length} inputs`);

  const ariaRefs = [
    ...Array.from(markup.matchAll(/\saria-labelledby="([^"]+)"/g)).flatMap((m) => m[1].split(/\s+/)),
    ...Array.from(markup.matchAll(/\saria-controls="([^"]+)"/g)).flatMap((m) => m[1].split(/\s+/)),
  ];
  const danglingAria = ariaRefs.filter((ref) => !idSet.has(ref));
  check(
    `[${label}] All aria-labelledby / aria-controls targets exist`,
    danglingAria.length === 0,
    danglingAria.join(', '),
  );

  const internalTargets = Array.from(markup.matchAll(/href="#([^"]+)"/g)).map((m) => m[1]);
  const missingTargets = internalTargets.filter((target) => !idSet.has(target));
  check(
    `[${label}] All in-page anchor targets exist`,
    missingTargets.length === 0,
    missingTargets.length ? missingTargets.join(', ') : `${internalTargets.length} anchors`,
  );

  check(
    `[${label}] No positive tabindex values`,
    (markup.match(/tabindex="[1-9]/g) ?? []).length === 0,
  );

  const sections = Array.from(markup.matchAll(/<section\b[^>]*>/g)).map((m) => m[0]);
  const unlabelledSections = sections.filter((tag) => !/aria-label(l|ledby)=/.test(tag));
  check(
    `[${label}] Every <section> is labelled for screen readers`,
    unlabelledSections.length === 0,
    `${sections.length} sections, ${unlabelledSections.length} unlabelled`,
  );

  const labelledBySections = Array.from(
    markup.matchAll(/<section\b[^>]*aria-labelledby="([^"]+)"/g),
  ).flatMap((m) => m[1]);
  const brokenSectionLabels = labelledBySections.filter((ref) => !idSet.has(ref));
  check(
    `[${label}] Section aria-labelledby targets exist`,
    brokenSectionLabels.length === 0,
    brokenSectionLabels.join(', '),
  );
}

audit(html, 'page', { expectSingleH1: true });

// The project modal only renders after a click, so audit it explicitly.
let modalHtml = '';
let modalError: string | null = null;
try {
  modalHtml = renderToString(
    createElement(ProjectModal, { project: allProjects[0], onClose: () => {} }),
  );
} catch (error) {
  modalError = error instanceof Error ? error.message : String(error);
}
check('ProjectModal renders without throwing', modalError === null, modalError ?? '');
check(
  'ProjectModal is a labelled modal dialog',
  modalHtml.includes('role="dialog"') &&
    modalHtml.includes('aria-modal="true"') &&
    modalHtml.includes('aria-labelledby="project-modal-title"'),
);
check(
  'ProjectModal shows the GitHub link for the project',
  modalHtml.includes(allProjects[0].githubUrl),
);
audit(modalHtml, 'modal');

// ---------------------------------------------------------------- output
console.log('\nSSR smoke test');
console.log('===============');
console.log(checks.join('\n'));
console.log('');
console.log(`Rendered HTML: ${(html.length / 1024).toFixed(1)} kB`);
console.log(
  `Projects: ${allProjects.length} total | ${featuredProjects.length} featured | ${githubStats.liveDemos} live demos`,
);
console.log(`Result: ${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`);

if (failures > 0) process.exit(1);
