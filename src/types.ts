/**
 * Central domain types for the portfolio data pipeline.
 *
 * Pipeline: GitHub API  ->  scripts/sync-github.mjs
 *                        ->  src/data/github.generated.json   (auto, do not hand-edit)
 *                        ->  src/data/projects.ts              (curated enrichment layer)
 *                        ->  src/lib/projects.ts               (normaliser / merge)
 *                        ->  UI components
 */

export const PROJECT_CATEGORIES = [
  'Web Development',
  'Data Analysis',
  'Machine Learning',
  'Computer Vision',
  'Academic',
  'Tools / Utility',
  'Other',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** Filter chips exposed in the "All Projects" section. */
export const PROJECT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web' },
  { id: 'data', label: 'Data / ML' },
  { id: 'vision', label: 'Computer Vision' },
  { id: 'academic', label: 'Academic' },
  { id: 'other', label: 'Other' },
] as const;

export type ProjectFilterId = (typeof PROJECT_FILTERS)[number]['id'];

/** How a technology was verified. Surfaced in the UI for transparency. */
export type TechSource = 'repo' | 'profile';

export interface Technology {
  name: string;
  group: TechGroup;
  source: TechSource;
}

export type TechGroup =
  | 'Languages'
  | 'Web Development'
  | 'Data & Machine Learning'
  | 'Database'
  | 'Tools & Platforms';

export interface Project {
  /** GitHub repository name, e.g. "kalender". Unique key. */
  id: string;
  name: string;
  /** Human-readable title used in the UI. Defaults to `name`. */
  title: string;
  /** 2-3 sentence natural description, written from actual repo contents. */
  description: string;
  /** What the project does / the problem it addresses. */
  problem: string;
  /** How it was approached. */
  solution: string;
  /** Primary category used for filtering. Exactly one. */
  category: ProjectCategory;
  /** Extra category labels (secondary). Never used as the primary filter key. */
  secondaryCategories?: ProjectCategory[];
  /** Verified technologies, no percentages, no invented items. */
  technologies: string[];
  /** Verified feature bullets. */
  features: string[];
  /** `https://github.com/ahmadragiel/{id}` — always valid, built from id. */
  githubUrl: string;
  /** Verified live demo URL, or null when none is confirmed. */
  liveUrl: string | null;
  /** Repository `homepage` field as reported by GitHub (may be null). */
  homepage: string | null;
  /** True only for hand-picked highlights. No ranking, no scoring. */
  featured: boolean;
  /** True when the repository is verifiably a coursework/academic project. */
  academic: boolean;
  language: string | null;
  stars: number;
  forks: number;
  createdAt: string | null;
  updatedAt: string | null;
  /** Local asset under /public used as the project visual. Null => abstract placeholder. */
  image: string | null;
  /** Drives the colour of the abstract placeholder when `image` is null. */
  visualTheme: ProjectVisualTheme;
  /** Lowercased haystack built once for fast client-side search. */
  searchIndex: string;
}

export type ProjectVisualTheme =
  | 'web'
  | 'vision'
  | 'data'
  | 'academic'
  | 'neutral';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  /** Free-form, e.g. "2026" or "March 2026". */
  date: string;
  category: string;
  /** Thumbnail / preview image. Optional. */
  image: string | null;
  /** The actual certificate file. Required. */
  file: string;
  credentialId?: string;
  credentialUrl?: string;
}

export type CertificateFormat = 'image' | 'pdf';

export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface GithubProfileSnapshot {
  login: string;
  name: string;
  location: string | null;
  bio: string | null;
  avatarUrl: string;
  htmlUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  updatedAt: string;
}

export interface GithubRepoSnapshot {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  homepage: string | null;
  htmlUrl: string;
  fork: boolean;
  archived: boolean;
  hasReadme: boolean;
  license: string | null;
}

export interface GithubSnapshot {
  /** ISO timestamp of the sync run. */
  fetchedAt: string;
  profile: GithubProfileSnapshot;
  repos: GithubRepoSnapshot[];
}

export interface CurrentGoal {
  label: string;
  detail: string;
  /** Verbatim status taken from the public profile README. */
  status: 'In Progress' | 'Targeting' | 'Planned';
}
