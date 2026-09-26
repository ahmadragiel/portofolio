import { useId, useState } from 'react';
import type { ProjectVisualTheme } from '../types';
import { cx } from '../lib/utils';

interface ProjectVisualProps {
  theme: ProjectVisualTheme;
  /** Real asset path. When provided it replaces the abstract composition. */
  image?: string | null;
  alt: string;
  /** Larger surface for the featured showcase. */
  variant?: 'card' | 'showcase';
  className?: string;
}

/**
 * Project visual.
 *
 * IMPORTANT: when a repository has no real screenshot, this renders an ABSTRACT
 * geometric composition. It is intentionally not a browser mockup with invented
 * content — fabricating a fake preview would misrepresent the project. The
 * fallback is labelled as abstract in the accessibility tree so it is never
 * mistaken for a screenshot.
 */

const THEME_STYLES: Record<
  ProjectVisualTheme,
  { from: string; to: string; ink: string; label: string }
> = {
  web: {
    from: 'from-blue-50',
    to: 'to-blue-100/60',
    ink: 'text-blue-600',
    label: 'Abstract web application preview',
  },
  vision: {
    from: 'from-indigo-50',
    to: 'to-blue-100/60',
    ink: 'text-indigo-600',
    label: 'Abstract computer vision preview',
  },
  data: {
    from: 'from-sky-50',
    to: 'to-blue-100/50',
    ink: 'text-sky-700',
    label: 'Abstract data and image processing preview',
  },
  academic: {
    from: 'from-slate-50',
    to: 'to-blue-50',
    ink: 'text-slate-600',
    label: 'Abstract academic project preview',
  },
  neutral: {
    from: 'from-slate-50',
    to: 'to-slate-100',
    ink: 'text-slate-400',
    label: 'Abstract project preview',
  },
};

/** Deterministic pseudo-random so a given project always gets the same shapes. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function ProjectVisual({
  theme,
  image,
  alt,
  variant = 'card',
  className,
}: ProjectVisualProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const style = THEME_STYLES[theme];
  /*
   * Several visuals with the same theme can be on the page at once, so the
   * pattern id must be unique per instance. Without this the DOM would contain
   * duplicate ids and every `url(#...)` reference would resolve to the first one.
   * React's useId returns characters that are awkward inside a URL fragment,
   * so everything non-alphanumeric is stripped.
   */
  const patternId = `pvgrid-${theme}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  if (image && !imageFailed) {
    return (
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        className={cx('h-full w-full object-cover', className)}
      />
    );
  }

  const seed = hashString(alt);
  const dots = Array.from({ length: variant === 'showcase' ? 7 : 5 }, (_, i) => {
    const angle = (seed % 360) * (Math.PI / 180) + i * 1.9;
    const radiusX = 18 + ((seed >> (i * 3)) % 26);
    const radiusY = 14 + ((seed >> (i * 2)) % 22);
    return {
      cx: 50 + Math.cos(angle) * radiusX,
      cy: 50 + Math.sin(angle) * radiusY,
      r: 2 + ((seed >> i) % 5),
      opacity: 0.2 + ((seed >> (i + 4)) % 5) * 0.12,
    };
  });

  return (
    <div
      className={cx(
        'relative isolate overflow-hidden bg-gradient-to-br',
        style.from,
        style.to,
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className={cx('absolute inset-0 h-full w-full', style.ink)}
        role="img"
        aria-label={style.label}
      >
        <defs>
          <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0v10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.35" />
          </pattern>
        </defs>

        <rect width="100" height="100" fill={`url(#${patternId})`} />

        {/* Concentric arcs: the recurring motif across every theme. */}
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.28" />
        <circle cx="50" cy="50" r="21" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.22" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.14" />

        {/* Soft focal glow. */}
        <circle cx="50" cy="50" r="13" fill="currentColor" opacity="0.1" />

        {/* Deterministic orbit dots. */}
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="currentColor" opacity={dot.opacity} />
        ))}

        {/* Abstract code bar motif, standing in for "source", not a real screenshot. */}
        <g opacity="0.3">
          <rect x="34" y="46" width="20" height="2" rx="1" fill="currentColor" />
          <rect x="38" y="50.5" width="24" height="2" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="34" y="55" width="14" height="2" rx="1" fill="currentColor" opacity="0.5" />
        </g>
      </svg>

      {/* Explicit marker so the abstract art is never read as a real screenshot. */}
      <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-wider text-slate-600 backdrop-blur-sm">
        Abstract preview
      </span>
    </div>
  );
}
