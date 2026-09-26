import type { Technology, TechGroup } from '../types';

/**
 * Technology list built ONLY from evidence found in the public repositories and
 * the public profile README. Nothing is included because it was "once studied".
 *
 * Evidence per item:
 *  repo     -> detected in package.json / composer.json / requirements-style
 *              README, or in the GitHub language metadata for that repository.
 *  profile  -> explicitly declared in https://github.com/ahmadragiel/ahmadragiel
 *              (profile README) but not yet exercised in a public repository.
 *
 * `profile` items are labelled in the UI so the distinction stays honest.
 */
export const techStack: Technology[] = [
  // ---------------------------------------------------------------- Languages
  { name: 'PHP', group: 'Languages', source: 'repo' },
  { name: 'JavaScript', group: 'Languages', source: 'repo' },
  { name: 'Python', group: 'Languages', source: 'repo' },
  { name: 'HTML5', group: 'Languages', source: 'repo' },
  { name: 'CSS3', group: 'Languages', source: 'repo' },
  { name: 'Blade', group: 'Languages', source: 'repo' },
  { name: 'C++', group: 'Languages', source: 'profile' },

  // ---------------------------------------------------------- Web Development
  { name: 'Laravel 12', group: 'Web Development', source: 'repo' },
  { name: 'Tailwind CSS 4', group: 'Web Development', source: 'repo' },
  { name: 'Alpine.js', group: 'Web Development', source: 'repo' },
  { name: 'Vanilla JavaScript', group: 'Web Development', source: 'repo' },
  { name: 'Blade Components', group: 'Web Development', source: 'repo' },
  { name: 'Eloquent ORM', group: 'Web Development', source: 'repo' },
  { name: 'Multi-role Auth', group: 'Web Development', source: 'repo' },
  { name: 'REST API', group: 'Web Development', source: 'repo' },
  { name: 'Service Layer', group: 'Web Development', source: 'repo' },

  // ------------------------------------------------- Data & Machine Learning
  { name: 'OpenCV', group: 'Data & Machine Learning', source: 'repo' },
  { name: 'MediaPipe', group: 'Data & Machine Learning', source: 'repo' },
  { name: 'NumPy', group: 'Data & Machine Learning', source: 'repo' },
  { name: 'Matplotlib', group: 'Data & Machine Learning', source: 'repo' },
  { name: 'scikit-image', group: 'Data & Machine Learning', source: 'repo' },
  { name: 'Fourier Transform', group: 'Data & Machine Learning', source: 'repo' },
  { name: 'gTTS', group: 'Data & Machine Learning', source: 'repo' },
  { name: 'Pygame', group: 'Data & Machine Learning', source: 'repo' },
  { name: 'Pandas', group: 'Data & Machine Learning', source: 'profile' },
  { name: 'Scikit-Learn', group: 'Data & Machine Learning', source: 'profile' },

  // ----------------------------------------------------------------- Database
  { name: 'MySQL', group: 'Database', source: 'repo' },
  { name: 'SQLite', group: 'Database', source: 'repo' },

  // -------------------------------------------------------- Tools & Platforms
  { name: 'Vite', group: 'Tools & Platforms', source: 'repo' },
  { name: 'Chart.js', group: 'Tools & Platforms', source: 'repo' },
  { name: 'ApexCharts', group: 'Tools & Platforms', source: 'repo' },
  { name: 'Fabric.js', group: 'Tools & Platforms', source: 'repo' },
  { name: 'Google Calendar API', group: 'Tools & Platforms', source: 'repo' },
  { name: 'Web Notifications API', group: 'Tools & Platforms', source: 'repo' },
  { name: 'PHPUnit', group: 'Tools & Platforms', source: 'repo' },
  { name: 'Git', group: 'Tools & Platforms', source: 'repo' },
  { name: 'GitHub Pages', group: 'Tools & Platforms', source: 'repo' },
  { name: 'Laragon', group: 'Tools & Platforms', source: 'repo' },
  { name: 'Visual Studio Code', group: 'Tools & Platforms', source: 'repo' },
  { name: 'Figma', group: 'Tools & Platforms', source: 'profile' },
];

/** Display order for the Tech Stack section. */
export const techGroupOrder: TechGroup[] = [
  'Languages',
  'Web Development',
  'Data & Machine Learning',
  'Database',
  'Tools & Platforms',
];

export const techGroupMeta: Record<TechGroup, { blurb: string }> = {
  Languages: {
    blurb: 'Core languages detected across public repositories.',
  },
  'Web Development': {
    blurb: 'Frameworks, styling, and patterns used to ship full-stack applications.',
  },
  'Data & Machine Learning': {
    blurb: 'Python tooling for computer vision, image processing, and analysis.',
  },
  Database: {
    blurb: 'Relational databases used in development, testing, and production targets.',
  },
  'Tools & Platforms': {
    blurb: 'Build tools, charting, testing, and platforms used in the workflow.',
  },
};

export const groupedTechStack = techGroupOrder.map((group) => ({
  group,
  blurb: techGroupMeta[group].blurb,
  items: techStack.filter((tech) => tech.group === group),
}));
