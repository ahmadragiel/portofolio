import type { Project } from '../types';
import { ProjectVisual } from './ProjectVisual';
import { TechBadgeList } from './TechBadge';
import { ArrowUpRightIcon, CodeIcon, ExternalLinkIcon, ForkIcon, StarIcon } from './icons';
import { formatDate } from '../lib/utils';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  /** 1-based position, used only to stagger the reveal animation. */
  index?: number;
}

export function ProjectCard({ project, onOpen, index = 0 }: ProjectCardProps) {
  const {
    title,
    description,
    category,
    technologies,
    githubUrl,
    liveUrl,
    language,
    stars,
    forks,
    updatedAt,
    academic,
    image,
    visualTheme,
  } = project;

  return (
    <article
      className="card accent-top group relative flex h-full flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]"
      style={{ transitionDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      {/* Visual */}
      <div className="relative">
        <ProjectVisual
          theme={visualTheme}
          image={image}
          alt={`${title} project visual`}
          className="h-40 w-full"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="badge badge-accent backdrop-blur-sm">{category}</span>
          {academic ? (
            <span className="badge bg-white/90 backdrop-blur-sm">Academic Project</span>
          ) : null}
        </div>

        {liveUrl ? (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-blue-700 backdrop-blur-sm">
            <ExternalLinkIcon className="text-[0.8125rem]" />
            Live
          </span>
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.0625rem] leading-snug font-bold text-navy-900">
          {/* Whole-card click target. */}
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="text-left transition-colors after:absolute after:inset-0 hover:text-blue-700 focus-visible:outline-none"
          >
            {title}
          </button>
        </h3>

        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{description}</p>

        <TechBadgeList items={technologies} max={4} className="mt-4" />

        {/* Meta row — only facts that exist. */}
        <dl className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line-soft pt-4 text-xs text-faint">
          {language ? (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Primary language</dt>
              <CodeIcon className="text-[0.875rem]" />
              <dd>{language}</dd>
            </div>
          ) : null}

          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Stars</dt>
            <StarIcon className="text-[0.875rem]" />
            <dd>{stars}</dd>
          </div>

          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Forks</dt>
            <ForkIcon className="text-[0.875rem]" />
            <dd>{forks}</dd>
          </div>

          <div className="ml-auto">
            <dt className="sr-only">Last updated</dt>
            <dd>Updated {formatDate(updatedAt)}</dd>
          </div>
        </dl>

        {/* Actions — the card title overlay sits above these, so raise them. */}
        <div className="relative z-10 mt-4 flex flex-wrap gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary flex-1 !px-3 !py-2 !text-[0.8125rem]"
            aria-label={`View ${title} repository on GitHub (opens in a new tab)`}
          >
            <CodeIcon className="text-[0.9375rem]" />
            GitHub
            <ArrowUpRightIcon className="text-[0.875rem] opacity-60" />
          </a>

          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex-1 !px-3 !py-2 !text-[0.8125rem]"
              aria-label={`Open the ${title} live demo (opens in a new tab)`}
            >
              <ExternalLinkIcon className="text-[0.9375rem]" />
              Live Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** Compact row variant used inside the project detail modal's "at a glance" area. */
export function ProjectMetaRow({ project }: { project: Project }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
      <div>
        <dt className="text-xs font-medium tracking-wide text-faint uppercase">Category</dt>
        <dd className="mt-1 font-medium text-ink">{project.category}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium tracking-wide text-faint uppercase">Language</dt>
        <dd className="mt-1 font-medium text-ink">{project.language ?? 'Not detected'}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium tracking-wide text-faint uppercase">Created</dt>
        <dd className="mt-1 font-medium text-ink">{formatDate(project.createdAt)}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium tracking-wide text-faint uppercase">Last updated</dt>
        <dd className="mt-1 font-medium text-ink">{formatDate(project.updatedAt)}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium tracking-wide text-faint uppercase">Stars</dt>
        <dd className="mt-1 font-medium text-ink">{project.stars}</dd>
      </div>
      <div>
        <dt className="text-xs font-medium tracking-wide text-faint uppercase">Forks</dt>
        <dd className="mt-1 font-medium text-ink">{project.forks}</dd>
      </div>
    </dl>
  );
}
