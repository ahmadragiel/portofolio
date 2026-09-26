import { useDeferredValue, useMemo, useState } from 'react';
import { PROJECT_FILTERS, type Project, type ProjectFilterId } from '../types';
import { allProjects, countByFilter, matchesFilter, matchesQuery } from '../lib/projects';
import { Section } from './Section';
import { ProjectCard } from './ProjectCard';
import { useReveal } from '../hooks/useReveal';
import { CloseIcon, RepoIcon, SearchIcon } from './icons';
import { cx } from '../lib/utils';

interface AllProjectsProps {
  onOpen: (project: Project) => void;
}

export function AllProjects({ onOpen }: AllProjectsProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ProjectFilterId>('all');
  const { ref, visible } = useReveal<HTMLDivElement>();

  // Keeps typing responsive while the list re-filters.
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => countByFilter(allProjects), []);

  const results = useMemo(
    () =>
      allProjects.filter(
        (project) => matchesFilter(project, filter) && matchesQuery(project, deferredQuery),
      ),
    [filter, deferredQuery],
  );

  const hasQuery = deferredQuery.trim().length > 0;

  return (
    <Section
      id="projects"
      eyebrow="Portfolio"
      title="All Projects"
      lead="Every public repository that is worth showing, taken straight from GitHub. Search by name, description, category, or technology."
      tone="white"
      aside={
        <p className="text-xs text-faint">
          {allProjects.length} project{allProjects.length === 1 ? '' : 's'} listed
        </p>
      }
    >
      <div ref={ref} className={cx('reveal', visible && 'reveal-visible')}>
        {/* ------------------------- Controls ------------------------- */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="project-search" className="sr-only">
              Search projects by name, description, technology, or category
            </label>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-faint"
            >
              <SearchIcon />
            </span>
            <input
              id="project-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects..."
              autoComplete="off"
              className="w-full rounded-lg border border-line-strong bg-white py-2.5 pr-10 pl-10 text-sm text-ink transition-colors placeholder:text-muted hover:border-blue-400 focus:border-blue-600 focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-faint transition-colors hover:bg-canvas hover:text-navy-900"
              >
                <CloseIcon className="text-sm" />
              </button>
            ) : null}
          </div>

          {/* Filters */}
          <div
            role="group"
            aria-label="Filter projects by category"
            className="-mx-1 flex flex-wrap gap-1.5 px-1"
          >
            {PROJECT_FILTERS.map((item) => {
              const isActive = filter === item.id;
              const count = counts[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={isActive}
                  className={cx(
                    'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[0.8125rem] font-medium transition-[background-color,border-color,color] duration-150',
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-line-strong bg-white text-muted hover:border-blue-300 hover:text-blue-700',
                    /*
                     * Empty categories stay clickable on purpose. The filter is a
                     * normal button, so it remains reachable by keyboard, and the
                     * result area explains that nothing is published there yet
                     * instead of leaving a control that silently does nothing.
                     */
                    count === 0 && !isActive && 'opacity-70',
                  )}
                  title={
                    count === 0
                      ? `No ${item.label} projects published yet — select to see why`
                      : `${count} ${item.label} project${count === 1 ? '' : 's'}`
                  }
                >
                  {item.label}
                  <span
                    className={cx(
                      'rounded px-1.5 py-px font-mono text-[0.625rem]',
                      isActive ? 'bg-white/20 text-white' : 'bg-canvas text-muted',
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result count — announced to screen readers as it changes. */}
        <p aria-live="polite" className="mt-4 text-xs text-faint">
          {hasQuery || filter !== 'all'
            ? `${results.length} of ${allProjects.length} projects`
            : `Showing all ${allProjects.length} projects`}
        </p>

        {/* ------------------------- Grid ------------------------- */}
        {results.length > 0 ? (
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((project, index) => (
              <li key={project.id} className="flex">
                <ProjectCard project={project} onOpen={onOpen} index={index} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyResults query={deferredQuery} filter={filter} onReset={() => {
            setQuery('');
            setFilter('all');
          }} />
        )}
      </div>
    </Section>
  );
}

function EmptyResults({
  query,
  filter,
  onReset,
}: {
  query: string;
  filter: ProjectFilterId;
  onReset: () => void;
}) {
  const label = PROJECT_FILTERS.find((item) => item.id === filter)?.label ?? 'All';

  return (
    <div className="mt-6 rounded-[var(--radius-panel)] border border-dashed border-line bg-canvas px-6 py-16 text-center">
      <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-white text-2xl text-faint">
        <RepoIcon />
      </span>

      <p className="mt-5 text-base font-bold text-navy-900">No projects found.</p>

      <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-muted">
        {query ? (
          <>
            Nothing matches{' '}
            <span className="font-medium text-navy-900">&ldquo;{query.trim()}&rdquo;</span>
            {filter !== 'all' ? (
              <>
                {' '}
                in <span className="font-medium text-navy-900">{label}</span>.
              </>
            ) : (
              '.'
            )}{' '}
            Try a different term, or clear the filters to see everything.
          </>
        ) : (
          <>
            There are no published projects in{' '}
            <span className="font-medium text-navy-900">{label}</span> yet. That category appears
            in my toolkit and my current goals, but nothing public has shipped in it so far, and I
            would rather show an empty state than invent one.
          </>
        )}
      </p>

      <button type="button" onClick={onReset} className="btn btn-secondary mt-6 !py-2 !text-sm">
        Clear filters
      </button>
    </div>
  );
}
