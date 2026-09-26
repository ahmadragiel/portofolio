# Ahmad Ragiel Zaini — Developer Portfolio

Personal portfolio website for **Ahmad Ragiel Zaini**, Informatics Engineering Student
based in Indonesia, building real-world web applications and exploring computer vision,
data analysis, and machine learning.

The site is generated from real GitHub data. Nothing on it is invented: no fake projects,
no fake screenshots, no fabricated certificates, no hardcoded follower counts.

---

## Table of contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Build](#build)
- [Testing](#testing)
- [Deployment](#deployment)
- [Adding Projects](#adding-projects)
- [Adding Certificates](#adding-certificates)
- [GitHub Sync](#github-sync)
- [Data Integrity Rules](#data-integrity-rules)

---

## Project Overview

A single-page portfolio built with React and Vite, deployed as static files so it runs on
GitHub Pages, Vercel, and Netlify without a backend.

The core idea is a **data pipeline** rather than a hand-maintained page:

```text
GitHub REST API
      │
      ▼
scripts/sync-github.mjs          ← build-time fetch, verification, normalisation
      │
      ▼
src/data/github.generated.json   ← auto-generated, committed, never hand-edited
      │
      ├── merged with ──▶ src/data/projects.ts   ← human-written narrative layer
      │
      ▼
src/lib/projects.ts              ← merge + normalise + build search index
      │
      ▼
React components
```

Because the generated snapshot is committed, a failed or rate-limited GitHub sync can never
blank out the site. The frontend makes **zero GitHub API calls at runtime**.

---

## Features

| Section            | What it does                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **Navbar**         | Sticky, transparent over the hero then solid + blurred on scroll, active-section highlight, mobile drawer |
| **Hero**           | Headline, availability indicator, three CTAs, abstract `AR` monogram visual (no generated face)  |
| **About**          | 2–3 paragraph summary plus fact cards and the *Current Goals* table with verbatim statuses       |
| **Currently Exploring** | Six focus cards derived from the profile README and real repository technologies           |
| **Tech Stack**     | Five grouped lists built from detected evidence, with `profile` vs `repo` provenance marking      |
| **Certificates**   | 3/2/1 column grid, image lightbox and embedded PDF viewer, elegant empty state until files exist  |
| **Featured Projects** | Alternating 50/50 showcase layout with problem, approach, and tech badges                    |
| **All Projects**   | Live client-side search + six category filters with result counters                              |
| **GitHub Activity** | Derived stat tiles, recently-updated repositories, and snapshot provenance                       |
| **Contact**        | Real `mailto:` CTA plus the four published channels                                             |
| **Footer**         | Identity, navigation, social links, and current-year copyright                                   |

### Cross-cutting behaviour

- **Search** matches project name, description, category, technologies, and features. All terms
  must match. Fully client-side, no network requests.
- **Filters** (`All`, `Web`, `Data / ML`, `Computer Vision`, `Academic`, `Other`) are real
  buttons that stay keyboard reachable even when a category is empty, so the empty state can
  explain *why* rather than silently doing nothing.
- **Project detail** opens in a modal with focus trapping, `Escape` to close, focus restore,
  and scroll lock that compensates for the scrollbar so the page does not shift.
- **Live demos** only appear when the URL was verified to resolve with HTTP 200 at sync time.
- **No fake contribution graph.** GitHub only exposes contribution data through an
  authenticated endpoint, so the section links to the real graph instead of rendering
  an invented heatmap.

---

## Tech Stack

| Layer         | Choice                                                    |
| ------------- | --------------------------------------------------------- |
| Framework     | React 19                                                   |
| Language      | TypeScript 5.9 (strict)                                    |
| Build tool    | Vite 7                                                     |
| Styling       | Tailwind CSS 4 with a custom `@theme` token set            |
| Icons         | Hand-written inline SVG set (~30 icons)                    |
| Data          | Local TypeScript modules + one generated JSON snapshot     |
| Testing       | Custom SSR smoke test (52 assertions)                      |

Runtime dependencies: **React and ReactDOM only**. No icon package, no UI kit, no animation
library, no HTTP client.

### Why the icons are hand-written

The site needs roughly thirty glyphs. A full icon package would have cost more than the
entire rest of the bundle, so `src/components/icons.tsx` contains a small, consistent
inline SVG set that inherits `currentColor`.

---

## Project Structure

```text
portofolio/
├── index.html                     # SEO meta, Open Graph, font preconnect
├── vite.config.ts                 # production config (relative base for portability)
├── vite.smoke.config.ts           # separate SSR config for the smoke test
├── public/
│   ├── favicon.svg                # AR monogram
│   ├── og-image.svg               # social preview card
│   └── certificates/              # drop certificate files here
│       └── README.md
├── scripts/
│   ├── sync-github.mjs            # GitHub -> generated.json pipeline
│   └── smoke-test.tsx             # SSR render + accessibility audit
└── src/
    ├── main.tsx
    ├── App.tsx                    # section order, modal state, skip link
    ├── types.ts                   # all domain types + category/filter constants
    ├── index.css                  # design tokens, primitives, motion, a11y
    ├── data/
    │   ├── profile.ts             # identity, focus areas, goals, social links
    │   ├── projects.ts            # CURATED narrative layer, keyed by repo name
    │   ├── tech.ts                # technologies with repo/profile provenance
    │   ├── certificates.ts        # certificate data source (starts empty)
    │   └── github.generated.json  # AUTO-GENERATED — do not hand-edit
    ├── lib/
    │   ├── projects.ts            # merge, normalise, filter, search
    │   └── utils.ts               # date, relative time, file type helpers
    ├── hooks/
    │   ├── useReveal.ts           # IntersectionObserver reveal + stagger
    │   └── useModalBehaviour.ts   # focus trap, escape, scroll lock, restore
    └── components/
        ├── Navbar.tsx  Hero.tsx  About.tsx  CurrentlyExploring.tsx
        ├── TechStack.tsx  Certificates.tsx  FeaturedProjects.tsx
        ├── AllProjects.tsx  GithubActivity.tsx  Contact.tsx  Footer.tsx
        ├── Section.tsx  ProjectCard.tsx  ProjectModal.tsx
        ├── ProjectVisual.tsx  TechBadge.tsx  icons.tsx
```

---

## Local Development

Requires **Node.js 20.19+** (Node 22 LTS recommended).

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually <http://localhost:5173>.

### Available scripts

| Command               | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Start the dev server with hot module replacement           |
| `npm run build`       | Type-check with `tsc -b`, then build to `dist/`            |
| `npm run preview`     | Serve the production build locally                        |
| `npm run typecheck`   | Type-check only                                            |
| `npm run test:smoke`  | Render every component in Node and run 52 assertions        |
| `npm run sync:github` | Refresh the GitHub snapshot                                |

---

## Build

```bash
npm run build
```

Output:

```text
dist/index.html                 ~3 kB   │ gzip:  ~1.1 kB
dist/assets/style-*.css        ~60 kB   │ gzip: ~10.7 kB
dist/assets/react-*.js         ~12 kB   │ gzip:  ~4.2 kB
dist/assets/index-*.js        ~310 kB   │ gzip: ~93.2 kB
```

The build sets `base: './'` so all asset URLs are relative. That single setting makes the
output work unchanged on a domain root **and** inside a GitHub Pages project sub-path,
with no rebuild.

To deploy to a custom domain root instead, override the base:

```bash
SITE_BASE=/ npm run build
```

---

## Testing

```bash
npm run typecheck    # strict TypeScript, zero errors
npm run test:smoke   # SSR render + data + accessibility audit
```

The smoke test renders the whole app (and the project modal) to a string in Node, which
executes every component and every data path. It then asserts:

- **Rendering** — no throw, all eleven sections present, exactly one `<h1>`, current-year copyright.
- **Data integrity** — projects load from the snapshot, repository count is derived rather than
  hardcoded, every GitHub URL matches `github.com/ahmadragiel/{repo}`, no description contains a
  percentage or rating, live-demo links are all HTTPS, certificates are empty so none is fabricated.
- **Search and filter** — matches by name, technology, and category; rejects nonsense; multi-term
  search requires every term; every filter chip is wired.
- **Accessibility and structure** — no duplicate `id`s, no skipped heading levels, every `img`
  has `alt`, every link and button has an accessible name, every input is labelled, all
  `aria-labelledby`/`aria-controls` targets exist, all in-page anchors resolve, no positive
  `tabindex`, and every `<section>` is labelled.

The same audit runs against the modal markup, because that content only exists after a click
and would otherwise never be checked.

> **Note on manual QA:** a headless browser is not available in this environment, so visual
> and interaction checks across breakpoints were not performed. Everything above is automated
> and reproducible with the two commands in this section.

---

## Deployment

The build output in `dist/` is fully static.

### GitHub Pages

```bash
npm run build
git add -A
git commit -m "build: update portfolio"
git push
```

Then in the repository **Settings → Pages**, set the source to
**Deploy from a branch → `main` / `/ (root)`** and add `.nojekyll` to the repo root so the
`_`-prefixed asset paths are served verbatim.

### Vercel

```bash
npx vercel --prod
```

Framework preset: **Vite**. Build command `npm run build`, output directory `dist`.
No environment variables required.

### Netlify

```bash
npx netlify deploy --prod --dir=dist
```

Or connect the repository and use:

| Setting      | Value            |
| ------------ | ---------------- |
| Build command| `npm run build`  |
| Publish dir  | `dist`           |

---

## Adding Projects

You never need to touch a component. New projects arrive in two steps.

**Step 1 — push the repository to GitHub, then refresh the snapshot:**

```bash
npm run sync:github
```

The script picks up every public repository, verifies live-demo URLs, and rewrites
`src/data/github.generated.json`. The project now appears in *All Projects* using its
GitHub description and detected language.

**Step 2 — add the narrative.** Descriptions, features, category, and the `featured`
flag are human judgement, so they live in `src/data/projects.ts`:

```ts
export const projectEnrichment: Record<string, ProjectEnrichment> = {
  'my-new-repo': {
    title: 'My New Repo',
    description: 'Two or three natural sentences about what it does and how.',
    problem: 'The problem this project addresses.',
    solution: 'How you approached it.',
    category: 'Web Development',
    technologies: ['PHP', 'Laravel 12', 'MySQL'],
    features: ['First feature', 'Second feature', 'Third feature'],
    liveUrl: null,          // or a URL you have verified
    featured: false,        // true only to give it a large showcase
    academic: false,        // true only if it is verifiably coursework
    image: null,            // path under /public, or null for the abstract visual
    visualTheme: 'web',
  },
};
```

**Available values**

- `category` — exactly one of `Web Development`, `Data Analysis`, `Machine Learning`,
  `Computer Vision`, `Academic`, `Tools / Utility`, `Other`.
- `visualTheme` — `web`, `vision`, `data`, `academic`, `neutral`. Tints the abstract visual.
- `liveUrl` — include the key even when the value is `null`. An explicit `null` is treated as
  an editorial decision ("verified: no demo") and suppresses auto-detection. Omit the key
  entirely to let the sync-detected URL be used.

**To remove a repository** (for example this portfolio repo itself), add it to
`excludedRepos` in the same file. Enrichment entries without a matching GitHub repository
are ignored automatically, so a typo can never create a phantom project.

---

## Adding Certificates

The portfolio ships with **no certificates on purpose**, so the section shows an empty
state until real files exist.

**Step 1 — add the file** to `public/certificates/`:

```text
public/certificates/certificate-1.jpg
public/certificates/certificate-2.png
public/certificates/certificate-3.pdf
```

Supported: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`.

**Step 2 — register it** in `src/data/certificates.ts`:

```ts
export const certificates: Certificate[] = [
  {
    id: 'certificate-1',
    title: 'Certificate Name',       // required
    issuer: 'Issuing Institution',    // required
    date: '2026',
    category: 'Web Development',
    file: '/certificates/certificate-1.jpg',   // required
    image: '/certificates/certificate-1.jpg',  // optional preview
    credentialId: 'ABC-123',         // optional
    credentialUrl: 'https://...',    // optional
  },
];
```

The grid reflows to 3 / 2 / 1 columns automatically. Images open in a lightbox; PDFs embed
in a modal with an automatic "open in a new tab" fallback for browsers that refuse inline
rendering. Missing files render a clear inline error instead of a broken image.

No component changes are required.

---

## GitHub Sync

```bash
npm run sync:github
```

### What it does

1. Fetches `https://api.github.com/users/ahmadragiel`.
2. Paginates through **every** public repository.
3. Skips forks.
4. For each repository with GitHub Pages enabled, probes the public URL and records a demo
   link only if it returns HTTP 200.
5. Writes `src/data/github.generated.json` sorted by most recently pushed.
6. On failure, **leaves the previous snapshot untouched** and exits non-zero.

### Options

```bash
npm run sync:github -- --user someotheruser   # sync a different account
npm run sync:github -- --no-live-check         # skip the Pages HTTP probe (faster)
GITHUB_TOKEN=ghp_xxx npm run sync:github      # authenticated: 5,000 req/hr instead of 60
```

`GITHUB_TOKEN` is optional. Without it the script uses the unauthenticated rate limit, which
is plenty for a 10-repository account, but the token is recommended for CI.

### Adding it to a deploy

```bash
npm run sync:github && npm run build
```

Because the generated file is committed, running the sync is optional before a deploy. If
you do not run it, the site simply shows the previous snapshot, which is a complete and
correct portfolio rather than an error state.

---

## Data Integrity Rules

These constraints are enforced by the smoke test, not just by convention.

| Rule                                                    | Enforcement                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| No fabricated repositories                               | Projects can only come from the GitHub snapshot                 |
| No hardcoded repository count                            | Derived from `github.generated.json` at render time            |
| No dead live-demo buttons                               | URL must have returned HTTP 200 during sync                     |
| No fake screenshots                                      | Missing images fall back to a labelled abstract composition    |
| No fake certificates                                     | Section renders an empty state until real files are added       |
| No skill percentages or ratings                          | Data model has no field for them; asserted in the smoke test   |
| No invented social accounts                              | Only channels the owner actually publishes are listed           |
| No fake contribution graph                               | Not rendered; links to the real graph on GitHub instead        |
| Only verifiable technologies                             | Every item carries a `repo` or `profile` provenance flag        |

### Design system

Colour, radius, shadow, and motion are defined once as CSS custom properties in the
`@theme` block in `src/index.css`. Components consume tokens only, so the palette cannot
drift.

Contrast was checked against WCAG AA rather than chosen by eye. `--color-faint` is
`#68768a` (4.62:1 on white) — anything lighter, such as the more usual `#94a3b8`, fails at
2.56:1. `--color-line-strong` is `#8494a8` (3.1:1) and is used for control boundaries to
satisfy the 3:1 non-text requirement. Secondary text on navy surfaces uses `slate-400`
(7.3:1) rather than `slate-500` (3.9:1, a fail).

Motion is limited to fades, short rises, and hover lifts, and every animation is disabled
under `prefers-reduced-motion`.

---

## Contact

- **Email** — [ahmadragiel10@gmail.com](mailto:ahmadragiel10@gmail.com)
- **GitHub** — [@ahmadragiel](https://github.com/ahmadragiel)
- **LinkedIn** — [in/ahmadragielzaini](https://linkedin.com/in/ahmadragielzaini)
- **Instagram** — [@ragielzaini](https://instagram.com/ragielzaini)

---

## License

Built for personal portfolio use. Repository content and design belong to
Ahmad Ragiel Zaini.
