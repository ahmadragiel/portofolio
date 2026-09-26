import { useRef } from 'react';
import type { Project } from '../types';
import { useModalBehaviour } from '../hooks/useModalBehaviour';
import { ProjectVisual } from './ProjectVisual';
import { ProjectMetaRow } from './ProjectCard';
import { TechBadgeList } from './TechBadge';
import {
  ArrowUpRightIcon,
  CheckIcon,
  CloseIcon,
  CodeIcon,
  ExternalLinkIcon,
  ImageIcon,
} from './icons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalBehaviour(Boolean(project), onClose, dialogRef);

  if (!project) return null;

  const {
    title,
    description,
    problem,
    solution,
    category,
    secondaryCategories,
    technologies,
    features,
    githubUrl,
    liveUrl,
    image,
    visualTheme,
    academic,
  } = project;

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-navy-900/70 p-4 backdrop-blur-sm sm:p-6 lg:p-10"
      onClick={(event) => {
        // Close only when the backdrop itself is clicked.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        tabIndex={-1}
        className="animate-modal-in relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-12px_rgba(11,18,32,0.4)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute top-3.5 right-3.5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/90 text-muted backdrop-blur transition-colors hover:border-blue-300 hover:text-blue-700"
        >
          <CloseIcon className="text-lg" />
        </button>

        {/* Visual banner */}
        <ProjectVisual
          theme={visualTheme}
          image={image}
          alt={`${title} project visual`}
          variant="showcase"
          className="h-44 w-full sm:h-56"
        />

        <div className="max-h-[min(65vh,44rem)] overflow-y-auto overscroll-contain p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-accent">{category}</span>
            {secondaryCategories?.map((item) => (
              <span key={item} className="badge">
                {item}
              </span>
            ))}
            {academic ? <span className="badge">Academic Project</span> : null}
          </div>

          <h2
            id="project-modal-title"
            className="mt-3 text-2xl font-extrabold text-navy-900 sm:text-3xl"
          >
            {title}
          </h2>

          <p className="mt-1.5 font-mono text-xs text-faint">
            github.com/{project.name}
          </p>

          <p className="mt-5 leading-relaxed text-[0.9375rem] text-muted">{description}</p>

          {/* Problem / solution */}
          {problem || solution ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {problem ? (
                <div className="rounded-xl border border-line bg-canvas p-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold tracking-wide text-navy-900 uppercase">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                    The problem
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{problem}</p>
                </div>
              ) : null}
              {solution ? (
                <div className="rounded-xl border border-blue-200 bg-blue-100/50 p-4">
                  <h3 className="flex items-center gap-2 text-xs font-bold tracking-wide text-blue-800 uppercase">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600" />
                    The approach
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-blue-900/75">{solution}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Technologies */}
          {technologies.length > 0 ? (
            <section aria-labelledby="pm-technologies" className="mt-7">
              <h3
                id="pm-technologies"
                className="text-xs font-bold tracking-wide text-navy-900 uppercase"
              >
                Technologies
              </h3>
              <TechBadgeList items={technologies} size="md" className="mt-3" />
            </section>
          ) : null}

          {/* Features */}
          {features.length > 0 ? (
            <section aria-labelledby="pm-features" className="mt-7">
              <h3
                id="pm-features"
                className="text-xs font-bold tracking-wide text-navy-900 uppercase"
              >
                What it does
              </h3>
              <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <CheckIcon className="mt-0.5 shrink-0 text-base text-blue-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Facts */}
          <section aria-labelledby="pm-facts" className="mt-7 border-t border-line pt-6">
            <h3
              id="pm-facts"
              className="text-xs font-bold tracking-wide text-navy-900 uppercase"
            >
              At a glance
            </h3>
            <div className="mt-4">
              <ProjectMetaRow project={project} />
            </div>
          </section>

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex-1"
            >
              <CodeIcon className="text-lg" />
              View on GitHub
              <ArrowUpRightIcon className="text-base opacity-70" />
            </a>

            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary flex-1"
              >
                <ExternalLinkIcon className="text-lg" />
                Open Live Demo
              </a>
            ) : (
              <p className="btn btn-secondary flex-1 cursor-default justify-center !text-muted">
                <ImageIcon className="text-lg" />
                No published demo for this project
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
