import { exploring } from '../data/profile';
import { Section } from './Section';
import { useRevealGroup } from '../hooks/useReveal';
import { cx } from '../lib/utils';

export function CurrentlyExploring() {
  const { ref, visible, delay } = useRevealGroup<HTMLDivElement>();

  return (
    <Section
      id="exploring"
      eyebrow="Focus"
      title="Currently Exploring"
      lead="What I am actively working on and learning right now."
      tone="soft-blue"
    >
      <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exploring.map((item, index) => (
          <div
            key={item.title}
            style={delay(index)}
            className={cx(
              'card group relative overflow-hidden p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]',
              visible ? 'reveal reveal-visible' : 'reveal',
            )}
          >
            {/* Numbered index, decorative only. */}
            <span
              aria-hidden="true"
              className="absolute top-5 right-5 font-mono text-2xl font-bold text-blue-100 transition-colors group-hover:text-blue-200"
            >
              {String(index + 1).padStart(2, '0')}
            </span>

            <h3 className="relative text-[1.0625rem] font-bold text-navy-900">
              {item.title}
            </h3>
            <p className="relative mt-2.5 text-sm leading-relaxed text-muted">{item.body}</p>

            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-0.5 scale-x-0 bg-gradient-to-r from-blue-600 to-blue-400 transition-transform duration-300 group-hover:scale-x-100"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
