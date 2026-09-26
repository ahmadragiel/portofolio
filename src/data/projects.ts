import type { ProjectCategory, ProjectVisualTheme } from '../types';

/**
 * CURATED ENRICHMENT LAYER.
 *
 * This file is keyed by GitHub repository name and holds the *narrative* half of
 * a project: description, problem, solution, features, category, technologies.
 * All live/factual numbers (stars, forks, dates, language) come from
 * `github.generated.json`, which is produced by `npm run sync:github`.
 *
 * To add a project:
 *   1. Push the repository to GitHub.
 *   2. Run `npm run sync:github` to pick up its metadata.
 *   3. Add an entry here (only the narrative fields are required).
 * Entries here that do not exist on GitHub are ignored, so it is always safe.
 *
 * A repository with no entry here still shows up in "All Projects" using the
 * GitHub description and language, so nothing is ever silently dropped.
 */
export interface ProjectEnrichment {
  title: string;
  description: string;
  problem: string;
  solution: string;
  category: ProjectCategory;
  secondaryCategories?: ProjectCategory[];
  technologies: string[];
  features: string[];
  /**
   * Only set this when the live URL has actually been verified to resolve.
   * The normaliser ignores it when the URL is unreachable or the repository
   * publishes no deployment.
   */
  liveUrl?: string | null;
  featured?: boolean;
  academic?: boolean;
  image?: string | null;
  visualTheme?: ProjectVisualTheme;
}

export const projectEnrichment: Record<string, ProjectEnrichment> = {
  // ========================================================================
  'kilat-print': {
    title: 'Kilat Print',
    description:
      'A Laravel platform for custom printing businesses, covering the full order lifecycle: catalog and product configuration, a server-side price engine, cart and checkout, bank-transfer payment verification, design review, production tracking, and quality control. Customers configure their own artwork in a Fabric.js editor, while admins and operators each get their own dashboard.',
    problem:
      'Custom printing orders have a lot of variable pricing — size, material, finishing, quantity, and per-design artwork — and the whole order then has to move through payment, design approval, production, and QC before it ships. Doing that with spreadsheets and chat messages loses track of state fast.',
    solution:
      'I modelled the workflow as an explicit status machine with a history table for every transition, moved all price calculation to the server inside a database transaction, and stored designs as structured JSON instead of flat screenshots. Uploaded files live on a private disk and are only served through authorised controller routes.',
    category: 'Web Development',
    technologies: [
      'PHP',
      'Laravel 12',
      'Eloquent ORM',
      'Blade',
      'Tailwind CSS 4',
      'Alpine.js',
      'Vite',
      'Chart.js',
      'Fabric.js',
      'MySQL',
      'PHPUnit',
    ],
    features: [
      'Three-role authentication with dedicated customer, admin, and operator areas',
      'Fabric.js design editor with front/back mockups, layers, text, stickers, drag/resize/rotate/flip, and viewport zoom',
      'Server-side price engine supporting per-item, per-square-metre, per-metre, fixed, and additional-fee rules',
      'Cart and checkout that always recalculate totals on the server inside a database transaction',
      'Bank transfer flow with payment-proof upload, admin verification, rejection, and re-upload',
      'Private design file versioning with approval and revision requests',
      'Production assignment, progress tracking, quality check pass/fail, rework, and production photos',
      'Sales reports, dashboards, database notifications, and printable invoices',
      '83 automated tests covering auth, cart, checkout, payments, pricing, and order status',
    ],
    liveUrl: null,
    featured: true,
    academic: false,
    image: null,
    visualTheme: 'web',
  },

  // ========================================================================
  'playstation-rental-system': {
    title: 'PlayStation Rental System',
    description:
      'A web application for running a PlayStation rental business, with a public site for customers and an admin dashboard for the operator. Customers browse packages, units, games, and the schedule, then book a unit for a date and time; the admin side manages bookings, units, packages, games, payments, and reports.',
    problem:
      'Rental businesses usually track bookings in a notebook or a chat group, which makes it easy to double-book a console or promise a unit that is already in maintenance. Pricing and revenue reporting end up as manual arithmetic.',
    solution:
      'I split the app into a public-facing site and a role-protected admin area, then put the availability rules in the booking service so conflicting bookings and maintenance units are rejected before they are written. Revenue and usage reports are generated from the booking and payment tables, with PDF export for printing.',
    category: 'Web Development',
    technologies: [
      'PHP',
      'Laravel 12',
      'Eloquent ORM',
      'Blade',
      'Tailwind CSS 4',
      'Alpine.js',
      'ApexCharts',
      'Vite',
      'MySQL',
      'dompdf',
    ],
    features: [
      'Public landing site with packages, units, games, facilities, and schedule pages',
      'Online booking flow with automatic total price calculation',
      'Double-booking prevention and rejection of units in maintenance',
      'Booking status workflow from pending through confirmed, paid, ongoing, completed, or cancelled',
      'Payment tracking for cash, bank transfer, and QRIS',
      'Admin dashboard with today and monthly revenue plus booking charts',
      'Reports for revenue, bookings, and unit usage with date-range filters and PDF export',
      'PlayStation unit management with availability, in-use, and maintenance states',
    ],
    liveUrl: null,
    featured: true,
    academic: false,
    image: null,
    visualTheme: 'web',
  },

  // ========================================================================
  'kalender': {
    title: 'Kalender Indonesia',
    description:
      'A browser-based calendar for Indonesia that pulls national holidays from the Google Calendar API and layers Javanese primbon calculations on top. It also keeps personal events with optional reminders via the Web Notifications API, and everything personal is stored locally in the browser.',
    problem:
      'Indonesian users often need three things at once: national holiday dates, Javanese weton and pasar-day calculations, and their own agenda. Existing calendar apps handle at most one of these, and none of them keep the data on-device by default.',
    solution:
      'I built a single-page app with a central state object, a self-contained weton engine for day/pasar neptu and compatibility scoring, and a read-only Google Calendar fetch for holidays. The weton half runs completely offline, so the calendar still works if the API key is missing or the quota is exhausted.',
    category: 'Web Development',
    technologies: [
      'HTML5',
      'CSS3',
      'Vanilla JavaScript',
      'Google Calendar API',
      'Web Notifications API',
      'localStorage',
    ],
    features: [
      'Interactive month grid with animated transitions and swipe navigation on mobile',
      'Javanese pasar day (Legi, Pahing, Pon, Wage, Kliwon) shown on every date cell',
      'Indonesian national holidays fetched live from the Google Calendar API',
      'Weton engine with day and pasar neptu, total neptu, personality, and auspicious-day detection',
      'Compatibility checker for two birth dates with a named primbon result',
      'Personal event create, edit, and delete with optional time-based reminders',
      'Background notification check running every minute',
      'Six colour themes and a dedicated weton tab, both persisted in localStorage',
    ],
    liveUrl: null,
    featured: false,
    academic: false,
    image: null,
    visualTheme: 'web',
  },

  // ========================================================================
  'hand-gesture-perkenalan': {
    title: 'Hand Gesture Recognition',
    description:
      'A webcam application that recognises hand gestures and uses them to speak an introduction in Indonesian. It tracks up to two hands at once, maps finger positions to sixteen gestures, and plays generated text-to-speech audio with a cooldown so the same phrase is not repeated.',
    problem:
      'Introducing yourself through a projector or during a demo usually means clicking through slides. A gesture interface removes the keyboard entirely, but naive implementations misfire constantly because lighting and hand position change what the camera sees.',
    solution:
      'I built palm detection on three signals at once — brightness, depth, and surface normal — to decide whether a detected hand is showing its palm or its back before classifying the fingers. Dual-hand combinations are checked first and fall back to single-hand gestures, and generated audio is cached by a hash of the phrase so repeated gestures cost no network time.',
    category: 'Computer Vision',
    secondaryCategories: ['Machine Learning'],
    technologies: [
      'Python',
      'OpenCV',
      'MediaPipe',
      'NumPy',
      'gTTS',
      'Pygame',
    ],
    features: [
      'Simultaneous tracking of up to two hands',
      'Sixteen gestures: eight single-hand plus eight dual-hand combinations',
      'Indonesian text-to-speech with hash-keyed audio caching',
      'Three-method palm detection using brightness, depth, and normal vectors',
      'On-screen gesture guide toggled with the G key',
      'Single-hand and dual-hand mode badges on the video overlay',
      'Automatic fallback across camera indexes 0 to 3',
      'Cooldown timer and a per-finger debug overlay',
    ],
    liveUrl: null,
    featured: true,
    academic: false,
    image: null,
    visualTheme: 'vision',
  },

  // ========================================================================
  'Pengolahan-Citra-Digital': {
    title: 'Digital Image Processing Study',
    description:
      'A coursework project on digital image quality improvement, comparing two families of denoising techniques. It injects salt-and-pepper noise into a source image, then restores it with a median filter in the spatial domain and a circular low-pass filter in the frequency domain, and renders a side-by-side comparison.',
    problem:
      'The theory distinguishes spatial and frequency domain filtering, but the trade-off is only obvious once you run both on the same noisy image and look at what each one does to detail.',
    solution:
      'I generated the noise with scikit-image so the input is reproducible, denoised spatially with an OpenCV median filter, then took the image into the frequency domain with a NumPy FFT and applied a circular low-pass mask before inverting it back. All four stages are written to the assets folder and plotted in a single figure for comparison.',
    category: 'Computer Vision',
    secondaryCategories: ['Academic'],
    technologies: [
      'Python',
      'OpenCV',
      'NumPy',
      'Matplotlib',
      'scikit-image',
    ],
    features: [
      'Reproducible salt-and-pepper noise injection at a fixed ratio',
      'Spatial domain denoising with a 5x5 median filter',
      'Frequency domain denoising with a circular low-pass mask over the FFT spectrum',
      'Before-and-after comparison plotted as a single 2x2 Matplotlib figure',
      'Results written back to the assets folder as reproducible output',
    ],
    liveUrl: 'https://ahmadragiel.github.io/Pengolahan-Citra-Digital/',
    featured: true,
    academic: true,
    image: null,
    visualTheme: 'data',
  },

  // ========================================================================
  'CodingCamp-7Sept26-AhmadRagielZaini': {
    title: 'Life Dashboard',
    description:
      'A mini project for a RevoU coding camp: a personal life dashboard that combines a live clock, a Pomodoro focus timer, and a to-do list in one responsive page. Tasks and quick links persist in localStorage, and the three course challenges — theme switching, a custom greeting name, and a configurable timer length — are all implemented.',
    problem:
      'A Pomodoro timer, a to-do list, and a link shelf are usually three separate tabs. Combining them into one small, dependency-free dashboard shows how much state can be managed with plain browser APIs.',
    solution:
      'I split the code into small stores for settings, tasks, and links, each with its own localStorage persistence and a runtime availability check so the UI degrades cleanly when storage is blocked. The timer drives a progress ring from a single remaining-seconds value rather than from scattered interval state.',
    category: 'Web Development',
    technologies: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    features: [
      'Live clock, current date, and time-based greeting',
      'Pomodoro timer with start, pause, reset, and an animated progress ring',
      'To-do list with add, edit, complete, delete, and duplicate prevention',
      'Quick links shelf with add and delete',
      'Light and dark theme switching',
      'Custom name in the greeting',
      'Configurable Pomodoro length from 5 to 120 minutes',
      'Responsive layout for desktop and mobile',
    ],
    liveUrl: 'https://ahmadragiel.github.io/CodingCamp-7Sept26-AhmadRagielZaini/',
    featured: false,
    academic: true,
    image: null,
    visualTheme: 'web',
  },

  // ========================================================================
  'SmartDeal': {
    title: 'SmartDeal',
    description:
      'A single-file landing page for a product recommendation concept, published in Indonesian and built around six sections: what SmartDeal is, recommended products, differentiators, target customers, revenue streams, and a closing call to action. Everything is inline — no build step, no framework, no external scripts.',
    problem:
      'A recommendation site is mostly content, and a heavy toolchain for a single page adds a lot of deployment surface for very little benefit.',
    solution:
      'I wrote the whole thing as one self-contained HTML file with CSS custom properties for the palette and a small IntersectionObserver script for scroll reveals. There is no runtime dependency beyond two Google Fonts, so it deploys as-is to GitHub Pages.',
    category: 'Web Development',
    technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'IntersectionObserver'],
    features: [
      'Six content sections: about, products, advantages, target, revenue, and CTA',
      'Product recommendation cards with inline vector illustrations',
      'Colour palette driven entirely by CSS custom properties',
      'Scroll-triggered reveal animations via IntersectionObserver',
      'Responsive layout down to mobile widths',
      'Published as a single 458 KB HTML file with no build step',
    ],
    liveUrl: 'https://ahmadragiel.github.io/SmartDeal/',
    featured: false,
    academic: false,
    image: null,
    visualTheme: 'web',
  },

  // ========================================================================
  'tugas-pemrograman-web1': {
    title: 'Web Programming 1 — Coursework',
    description:
      'My first web programming coursework: a small multi-page site built with plain HTML tables and a classic sidebar navigation layout. It contains a home page, a profile page, and two practice pages, and it is the earliest public web work in my repositories.',
    problem:
      'The assignment was deliberately framework-free, so the goal was to understand how documents, links, tables, and page structure work before adding any abstraction.',
    solution:
      'I used a table-based layout with a header row, a navigation column, a content area, and a footer, then linked the pages together with relative anchors. It is intentionally simple, and it is useful to keep as a baseline for how far the later work has moved.',
    category: 'Academic',
    technologies: ['HTML'],
    features: [
      'Four linked pages: home, profile, and two practice pages',
      'Table-based layout with header, navigation, content, and footer regions',
      'Relative linking between pages for multi-page navigation',
      'Profile page with an embedded photo',
      'Table usage practice page',
    ],
    liveUrl: 'https://ahmadragiel.github.io/tugas-pemrograman-web1/',
    featured: false,
    academic: true,
    image: null,
    visualTheme: 'academic',
  },

  // ========================================================================
  // The special `username/username` profile repository. Real, public, and worth
  // showing because it is the published profile README.
  'ahmadragiel': {
    title: 'GitHub Profile',
    description:
      'My GitHub profile repository. It holds the published profile README: the short bio, current goals, the tech stack badges, and the contact links that point to the same sources used across this site.',
    problem:
      'A profile README is the one page that is always loaded when someone opens the GitHub tab, so it needs to state clearly who I am and what I am working on.',
    solution:
      'I kept it factual and short: a one-line role, three focus areas, the current goals table, the stack I actually use, and direct links to email and Instagram. Anything I have not built yet is not claimed there.',
    category: 'Other',
    technologies: ['Markdown'],
    features: [
      'Role, location, and availability stated up front',
      'Current goals with explicit status labels',
      'Tech stack badges grouped by category',
      'Direct contact links to email and Instagram',
    ],
    liveUrl: null,
    featured: false,
    academic: false,
    image: null,
    visualTheme: 'neutral',
  },
};

/**
 * Repositories that should never be listed, even if they appear in the API
 * response. The portfolio itself is this site, and empty placeholders have
 * nothing to show.
 */
export const excludedRepos: Record<string, string> = {
  portofolio: 'This repository hosts the portfolio itself.',
};
