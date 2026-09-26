import type { Project } from '../types';
import { ProjectVisual } from './ProjectVisual';
import { TechBadgeList } from './TechBadge';
import { ArrowUpRightIcon, CodeIcon, ExternalLinkIcon, ImageIcon, StarIcon, ForkIcon } from './icons';
import { formatDate } from '../lib/utils';
import { cx } from '../lib/utils';

interface FeaturedProjectsProps {
  projects: Project[];
  onOpen: (project: Project) => void;
}

/**
 * Featured showcase.
 *
 * `featured: true` only means a project is given more room. There is no ranking,
 * no score, and no "#1" label, because the underlying data does not support any
 * objective ordering of personal work.
 */
export function FeaturedProjects({ projects, onOpen }: FeaturedProjectsProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-[var(--radius-panel)] border border-dashed border-line bg-white px-6 py-16 text-center">
        <p className="text-sm font-semibold text-navy-900">No featured projects yet.</p>
        <p className="mt-2 text-sm text-muted">
          Set <code className="font-mono text-xs text-blue-700">featured: true</code> on a project
          in <code className="font-mono text-xs text-blue-700">src/data/projects.ts</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <FeaturedShowcase
          key={project.id}
          project={project}
          onOpen={() => onOpen(project)}
          reversed={index % 2 === 1}
        />
      ))}
    </div>
  );
}

function FeaturedShowcase({
  project,
  onOpen,
  reversed,
}: {
  project: Project;
  onOpen: () => void;
  reversed: boolean;
}) {
  return (
    <article
      className={cx(
        'card accent-top group grid overflow-hidden lg:grid-cols-2',
        'transition-[box-shadow,border-color] duration-200 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]',
      )}
    >
      {/* ---- Visual ---- */}
      <div className={cx('relative min-h-56 lg:min-h-full', reversed && 'lg:order-2')}>
        <ProjectVisual
          theme={project.visualTheme}
          image={project.image}
          alt={`${project.title} project visual`}
          variant="showcase"
          className="absolute inset-0 h-full w-full"
        />

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="badge badge-accent backdrop-blur-sm">{project.category}</span>
          {project.academic ? (
            <span className="badge bg-white/90 backdrop-blur-sm">Academic Project</span>
          ) : null}
        </div>
      </div>

      {/* ---- Content ---- */}
      <div className="flex flex-col p-6 sm:p-8">
        <p className="font-mono text-xs tracking-wide text-blue-600">{project.name}</p>

        <h3 className="mt-2 text-xl font-extrabold text-navy-900 sm:text-2xl">
          <button
            type="button"
            onClick={onOpen}
            className="text-left transition-colors hover:text-blue-700"
          >
            {project.title}
          </button>
        </h3>

        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
          {project.description}
        </p>

        <TechBadgeList items={project.technologies} max={5} className="mt-5" />

        <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-soft pt-4 text-xs text-faint">
          {project.language ? (
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Language</dt>
              <CodeIcon className="text-sm" />
              <dd>{project.language}</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Stars</dt>
            <StarIcon className="text-sm" />
            <dd>{project.stars}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Forks</dt>
            <ForkIcon className="text-sm" />
            <dd>{project.forks}</dd>
          </div>
          <div className="ml-auto">
            <dt className="sr-only">Last updated</dt>
            <dd>Updated {formatDate(project.updatedAt)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <button type="button" onClick={onOpen} className="btn btn-secondary !py-2 !text-sm">
            <ImageIcon className="text-base" />
            View details
          </button>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary !py-2 !text-sm"
          >
            <ExternalLinkIcon className="text-base" />
            View on GitHub
            <ArrowUpRightIcon className="text-sm opacity-70" />
          </a>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary !py-2 !text-sm"
            >
              Live Demo
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
