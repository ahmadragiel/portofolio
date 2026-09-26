import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import { cx } from '../lib/utils';

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  /** Alternating background treatment for smooth section transitions. */
  tone?: 'white' | 'soft' | 'soft-blue' | 'dark';
  children: ReactNode;
  className?: string;
  /** Right-aligned content in the section header (e.g. a result count). */
  aside?: ReactNode;
}

const TONE_CLASSES: Record<NonNullable<SectionProps['tone']>, string> = {
  white: 'bg-white',
  soft: 'bg-canvas',
  'soft-blue': 'bg-blue-100/45',
  dark: 'bg-navy-900 text-white',
};

export function Section({
  id,
  eyebrow,
  title,
  lead,
  tone = 'white',
  children,
  className,
  aside,
}: SectionProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const isDark = tone === 'dark';

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cx('scroll-mt-24 py-20 md:py-28', TONE_CLASSES[tone], className)}
    >
      <div className="container-page">
        <div
          ref={ref}
          className={cx(
            'reveal flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
            visible && 'reveal-visible',
          )}
        >
          <div className="max-w-2xl">
            <p className={cx('eyebrow', isDark && 'text-blue-300')}>{eyebrow}</p>
            <h2
              id={`${id}-heading`}
              className={cx(
                'section-title mt-3',
                isDark && '!text-white',
              )}
            >
              {title}
            </h2>
            {lead ? (
              <p className={cx('section-lead mt-4', isDark && '!text-slate-300')}>{lead}</p>
            ) : null}
          </div>
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>

        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}
