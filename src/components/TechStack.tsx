import { groupedTechStack, techStack } from '../data/tech';
import { Section } from './Section';
import { useRevealGroup } from '../hooks/useReveal';
import { GROUP_ICONS } from './icons';
import { cx } from '../lib/utils';

export function TechStack() {
  const { ref, visible, delay } = useRevealGroup<HTMLDivElement>();
  const profileOnlyCount = techStack.filter((tech) => tech.source === 'profile').length;

  return (
    <Section
      id="skills"
      eyebrow="Toolkit"
      title="Tech Stack"
      lead="Everything listed here was detected in my public repositories or declared on my public GitHub profile. Nothing is included just because I have read about it."
      tone="white"
      aside={
        <p className="max-w-[15rem] text-xs leading-relaxed text-faint">
          {techStack.length} technologies across {groupedTechStack.length} groups
        </p>
      }
    >
      <div ref={ref} className="space-y-8">
        {groupedTechStack.map((group, groupIndex) => {
          const Icon = GROUP_ICONS[group.group] ?? GROUP_ICONS['Tools & Platforms'];
          const headingId = `tech-group-${groupIndex}`;
          return (
            <section
              key={group.group}
              aria-labelledby={headingId}
              style={delay(groupIndex)}
              className={cx(
                'grid gap-5 lg:grid-cols-[16rem_1fr] lg:gap-8',
                visible ? 'reveal reveal-visible' : 'reveal',
              )}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-100 text-blue-700">
                  <Icon className="text-lg" />
                </span>
                <div>
                  <h3 id={headingId} className="text-[0.9375rem] font-bold text-navy-900">
                    {group.group}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{group.blurb}</p>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2">
                {group.items.map((tech) => {
                  const isProfileOnly = tech.source === 'profile';
                  return (
                    <li
                      key={tech.name}
                      title={
                        isProfileOnly
                          ? `${tech.name} — declared on my GitHub profile, not yet used in a public repository.`
                          : `${tech.name} — detected in a public repository.`
                      }
                      className={cx(
                        'group inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-[0.8125rem] font-medium text-ink transition-[transform,box-shadow,border-color,color] duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 hover:shadow-[var(--shadow-soft)]',
                        isProfileOnly
                          ? 'border-dashed border-blue-300 bg-blue-100/40 text-blue-800'
                          : 'border-line',
                      )}
                    >
                      {tech.name}
                      {isProfileOnly ? (
                        /* Explicit text marker: the distinction is not colour-only. */
                        <span className="rounded bg-white/80 px-1 py-px font-mono text-[0.5625rem] font-semibold tracking-wider text-blue-600 uppercase">
                          profile
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="mt-10 rounded-xl border border-dashed border-line bg-canvas px-4 py-3.5 text-xs leading-relaxed text-muted">
        <span className="font-semibold text-navy-900">How this list is built:</span> solid-bordered
        items are detected in a public repository &mdash; from language metadata,{' '}
        <code className="font-mono text-[0.6875rem] text-blue-700">composer.json</code>,{' '}
        <code className="font-mono text-[0.6875rem] text-blue-700">package.json</code>, or the
        repository README. Items marked{' '}
        <span className="rounded bg-blue-100 px-1 py-px font-mono text-[0.5625rem] font-semibold tracking-wider text-blue-600 uppercase">
          profile
        </span>{' '}
        are declared on my GitHub profile but not yet used in a published repository
        {profileOnlyCount > 0 ? ` (${profileOnlyCount} of them)` : ''}.
      </p>
    </Section>
  );
}
