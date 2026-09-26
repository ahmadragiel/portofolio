import type { CurrentGoal, SocialLink } from '../types';

/**
 * Every value in this file is taken from a source that can be verified publicly:
 *  - GitHub profile API  : https://api.github.com/users/ahmadragiel
 *  - GitHub profile README: https://github.com/ahmadragiel/ahmadragiel
 *
 * Nothing here is invented. If a fact cannot be verified, it is not present.
 */

export const GITHUB_USERNAME = 'ahmadragiel';
export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;

export const profile = {
  name: 'Ahmad Ragiel Zaini',
  initials: 'AR',
  role: 'Informatics Engineering Student',
  location: 'Indonesia',
  locationFlag: '\u{1F1EE}\u{1F1E9}',
  email: 'ahmadragiel10@gmail.com',
  status: 'Open to Internships & Collaborations',
  headline: "Hi, I'm Ahmad Ragiel.",
  subheadline: 'Informatics Engineering Student',
  tagline: 'Building Web Applications & Exploring Data and Machine Learning.',
  summary:
    'Building web applications and exploring computer vision, data analysis, and machine learning. Learning by shipping real projects, reading source, and iterating.',
  /** Verbatim bullets from the public profile README. */
  focusAreas: [
    'Building real-world web applications',
    'Learning machine learning & data analysis',
    'Problem solving & clean UI',
  ],
  philosophy: 'Keep it simple, make it work, then improve it.',
} as const;

/** Social links — only channels that are actually published by the owner. */
export const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    href: GITHUB_URL,
    handle: '@ahmadragiel',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ahmadragielzaini',
    handle: 'in/ahmadragielzaini',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/ragielzaini',
    handle: '@ragielzaini',
  },
  {
    label: 'Email',
    href: 'mailto:ahmadragiel10@gmail.com',
    handle: 'ahmadragiel10@gmail.com',
  },
];

/**
 * "Currently Exploring" cards.
 * Sourced from the profile README focus lines + verified repository technologies.
 */
export const exploring = [
  {
    title: 'Web Development',
    body: 'Building full-stack Laravel applications end to end — catalog, cart, checkout, payments, production workflow, admin dashboards, and reports.',
  },
  {
    title: 'Real-world Applications',
    body: 'Turning manual business processes into working systems: custom printing production, PlayStation rental booking, and scheduling.',
  },
  {
    title: 'Computer Vision',
    body: 'Hand landmark tracking with MediaPipe, gesture classification, and image enhancement across spatial and frequency domains with OpenCV.',
  },
  {
    title: 'Data Analysis',
    body: 'Working with NumPy, Pandas, and scikit-image to inspect, clean, and reason about data before and after processing.',
  },
  {
    title: 'Clean UI',
    body: 'Caring about readable interfaces, clear hierarchy, responsive layout, and accessible interactions over decoration.',
  },
  {
    title: 'Software Development',
    body: 'Version control discipline, automated tests, structured services, and readable codebases that stay maintainable.',
  },
] as const;

/** Verbatim "Current Goals" table from the public profile README. */
export const currentGoals: CurrentGoal[] = [
  {
    label: 'Build & deploy full-stack web applications',
    detail: 'Shipping complete Laravel applications with database, tests, and deployment.',
    status: 'In Progress',
  },
  {
    label: 'Level up in machine learning & data analysis',
    detail: 'Deepening Python, NumPy, scikit-learn, and practical analysis workflows.',
    status: 'In Progress',
  },
  {
    label: 'Land an internship in web / data development',
    detail: 'Looking for a team where I can contribute and keep learning.',
    status: 'Targeting',
  },
  {
    label: 'Contribute to open-source projects',
    detail: 'Reading other people’s code and shipping small, useful contributions.',
    status: 'Planned',
  },
];

export const about = {
  heading: 'About Me',
  eyebrow: 'About',
  paragraphs: [
    "I'm an Informatics Engineering student based in Indonesia. I build real-world web applications and, alongside that, keep pushing into computer vision, data analysis, and machine learning. Most of what I know about building software I learned by making projects end to end — reading the source, hitting the error, and fixing it.",
    'My current work is mostly full-stack Laravel: product catalogs, cart and checkout flows, payment verification, production tracking, admin dashboards, and automated tests. On the Python side I work with OpenCV and MediaPipe for hand gesture recognition and image enhancement, comparing spatial and frequency domain techniques.',
    "I care about keeping interfaces clean and readable, writing code that stays easy to maintain, and understanding what happens behind the surface. I'm open to internships and collaborations.",
  ],
} as const;

/** Compact About fact cards. Deliberately no numeric ratings. */
export const aboutFacts = [
  { label: 'Student', detail: 'Informatics Engineering' },
  { label: 'Web Development', detail: 'Laravel, Blade, Tailwind' },
  { label: 'Data & ML', detail: 'Python, OpenCV, NumPy' },
  { label: 'Problem Solving', detail: 'Break it down, then build' },
] as const;

export const contact = {
  heading: "Let's Connect",
  eyebrow: 'Contact',
  body: 'Open to internships, collaborations, and interesting tech discussions.',
} as const;
