import { about, aboutFacts, currentGoals, profile } from '../data/profile';
import { Section } from './Section';
import { useReveal } from '../hooks/useReveal';
import { CheckIcon, ClockIcon, SparkIcon } from './icons';
import { cx } from '../lib/utils';

const GOAL_STATUS_STYLES: Record<string, { chip: string; dot: string }> = {
  'In Progress': {
    chip: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-600',
  },
  Targeting: {
    chip: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  Planned: {
    chip: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
};

export function About() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Section
      id="about"
      eyebrow={about.eyebrow}
      title={about.heading}
      lead="A short, factual summary of where I am and what I work on."
      tone="white"
    >
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        {/* Narrative */}
        <div
          ref={ref}
          className={cx('reveal', visible && 'reveal-visible')}
        >
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="mt-5 leading-[1.8] text-muted first:mt-0">
              {paragraph}
            </p>
          ))}

          {/* Verbatim focus lines from the profile README. */}
          <ul className="mt-8 space-y-3 border-t border-line pt-7">
            {profile.focusAreas.map((area) => (
              <li key={area} className="flex items-start gap-3 text-[0.9375rem] text-ink">
                <CheckIcon className="mt-0.5 shrink-0 text-lg text-blue-600" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Facts + goals */}
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-3">
            {aboutFacts.map((fact) => (
              <div
                key={fact.label}
                className="card px-4 py-4 transition-colors hover:border-blue-200"
              >
                <dt className="font-mono text-[0.6875rem] tracking-wider text-blue-600 uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm leading-snug font-semibold text-navy-900">
                  {fact.detail}
                </dd>
              </div>
            ))}
          </dl>

          {/* Current goals — status labels are copied from the profile README. */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3.5">
              <ClockIcon className="text-base text-blue-600" />
              <h3 className="text-sm font-bold text-navy-900">Current Goals</h3>
            </div>

            <ul className="divide-y divide-line-soft">
              {currentGoals.map((goal) => {
                const style = GOAL_STATUS_STYLES[goal.status] ?? GOAL_STATUS_STYLES.Planned;
                return (
                  <li key={goal.label} className="px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm leading-snug font-medium text-ink">{goal.label}</p>
                      {/* Status is text, not just a colour, so it is never colour-only. */}
                      <span
                        className={cx(
                          'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold whitespace-nowrap',
                          style.chip,
                        )}
                      >
                        <span className={cx('h-1.5 w-1.5 rounded-full', style.dot)} />
                        {goal.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{goal.detail}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-100/50 px-4 py-3.5 text-xs leading-relaxed text-blue-900/80">
            <SparkIcon className="mt-px shrink-0 text-base text-blue-600" />
            <span>
              Goals and statuses are taken from my public GitHub profile, so this section never
              drifts from the source.
            </span>
          </p>
        </div>
      </div>
    </Section>
  );
}
