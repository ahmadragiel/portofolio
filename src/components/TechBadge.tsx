import { useState } from 'react';
import type { TechSource } from '../types';
import { cx } from '../lib/utils';

interface TechBadgeProps {
  name: string;
  source?: TechSource;
  /** Slightly larger variant for project detail panels. */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Technology chip.
 *
 * Items marked `source: 'profile'` are declared on the public profile README but
 * are not yet exercised in a public repository. They get a dashed border and an
 * explanatory tooltip, so the distinction is visible rather than hidden.
 */
export function TechBadge({ name, source = 'repo', size = 'sm', className }: TechBadgeProps) {
  const isProfileOnly = source === 'profile';

  return (
    <span
      className={cx(
        'badge',
        size === 'md' && 'px-3 py-1.5 text-[0.8125rem]',
        isProfileOnly && '!border-dashed !border-blue-300 !bg-blue-100/50 !text-blue-700',
        className,
      )}
      title={
        isProfileOnly
          ? `${name} — declared on my GitHub profile, not yet used in a public repository.`
          : name
      }
    >
      {name}
    </span>
  );
}

/** Convenience wrapper that renders a whole list of technology chips. */
export function TechBadgeList({
  items,
  size = 'sm',
  max,
  className,
}: {
  items: string[];
  size?: 'sm' | 'md';
  /** Show at most this many and collapse the rest into a "+N" chip. */
  max?: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = max && !expanded ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;

  return (
    <div className={cx('flex flex-wrap gap-1.5', className)}>
      {visible.map((item) => (
        <TechBadge key={item} name={item} size={size} />
      ))}
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="badge transition-colors hover:!border-blue-300 hover:!text-blue-700"
          aria-label={`Show ${hidden} more technolog${hidden === 1 ? 'y' : 'ies'}`}
        >
          +{hidden}
        </button>
      ) : null}
    </div>
  );
}
