import type { ReactNode } from 'react';
import { GITHUB_URL, profile } from '../data/profile';
import { ArrowRightIcon, GithubIcon, MailIcon, SparkIcon } from './icons';
import { useReveal } from '../hooks/useReveal';

/**
 * Hero.
 *
 * There is no photograph, and none is generated. The right-hand visual is an
 * abstract composition built from initials and code-inspired geometry, which
 * keeps the focus on the work rather than on a face.
 */
export function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-navy-900 pt-28 pb-20 md:pt-36 md:pb-28"
    >
      {/* ---- Background: radial glow + grid, both subtle ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_70%_10%,rgba(37,99,235,0.28),transparent_60%),radial-gradient(ellipse_50%_45%_at_15%_85%,rgba(59,130,246,0.16),transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* ---------------- Left: content ---------------- */}
          <div
            ref={ref}
            className={`reveal ${visible ? 'reveal-visible' : ''} max-w-2xl`}
          >
            {/* Availability */}
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pr-4 pl-2.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {profile.status}
            </p>

            <h1
              id="hero-heading"
              className="mt-6 text-[2.5rem] leading-[1.08] font-extrabold tracking-tight text-white sm:text-6xl lg:text-[3.75rem]"
            >
              Hi, I&rsquo;m{' '}
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                Ahmad Ragiel
              </span>
              <span className="text-blue-400">.</span>
            </h1>

            <p className="mt-6 text-lg font-semibold text-slate-200 sm:text-xl">
              {profile.subheadline}
            </p>
            <p className="mt-1 text-lg text-blue-300/90 sm:text-xl">{profile.tagline}</p>

            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-slate-400 sm:text-base">
              {profile.summary}
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#projects" className="btn btn-primary !px-5 !py-3">
                Explore My Work
                <ArrowRightIcon className="text-lg" />
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-light !px-5 !py-3"
              >
                <GithubIcon className="text-lg" />
                View GitHub
              </a>
              <a href="#contact" className="btn btn-ghost-light !px-5 !py-3">
                <MailIcon className="text-lg" />
                Let&rsquo;s Connect
              </a>
            </div>

            {/* Meta strip */}
            <dl className="mt-11 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-7">
              <div>
                <dt className="font-mono text-[0.6875rem] tracking-wider text-slate-400 uppercase">
                  Role
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-200">{profile.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] tracking-wider text-slate-400 uppercase">
                  Location
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-200">
                  {profile.locationFlag} {profile.location}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] tracking-wider text-slate-400 uppercase">
                  Focus
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-200">
                  Web &middot; Data &middot; Machine Learning
                </dd>
              </div>
            </dl>
          </div>

          {/* ---------------- Right: abstract visual ---------------- */}
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

/**
 * Abstract developer visual: initials monogram inside concentric blue orbits
 * with a few floating code glyphs. Purely decorative, hidden from assistive tech.
 */
function HeroVisual() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`reveal relative mx-auto w-full max-w-md lg:max-w-none ${visible ? 'reveal-visible' : ''}`}
    >
      <div className="relative aspect-square">
        {/* Orbit rings */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[12%] rounded-full border border-blue-400/20" />
        <div
          className="absolute inset-[24%] rounded-full border border-dashed border-blue-300/20"
          style={{ animation: 'orbit 60s linear infinite' }}
        />

        {/* Soft glow */}
        <div className="absolute inset-[18%] rounded-full bg-blue-500/20 blur-3xl" />

        {/* Monogram */}
        <div className="absolute inset-[26%] flex items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center rounded-[28%] border border-white/15 bg-gradient-to-br from-blue-500/25 to-blue-700/10 shadow-[0_24px_80px_-20px_rgba(37,99,235,0.7)] backdrop-blur-xl">
            <span className="font-mono text-6xl font-bold tracking-tight text-white/95 sm:text-7xl">
              {profile.initials}
            </span>
            {/* Corner brackets: the "editor" motif */}
            <span className="absolute top-3 left-3 h-5 w-5 rounded-tl-md border-t-2 border-l-2 border-blue-300/60" />
            <span className="absolute top-3 right-3 h-5 w-5 rounded-tr-md border-t-2 border-r-2 border-blue-300/60" />
            <span className="absolute bottom-3 left-3 h-5 w-5 rounded-bl-md border-b-2 border-l-2 border-blue-300/60" />
            <span className="absolute right-3 bottom-3 h-5 w-5 rounded-br-md border-r-2 border-b-2 border-blue-300/60" />
          </div>
        </div>

        {/* Floating glyph chips — a few, slow, subtle. */}
        <FloatChip className="top-[6%] left-[-2%]" delay="0s" duration="7s">
          {'{ }'}
        </FloatChip>
        <FloatChip className="top-[30%] right-[-4%]" delay="0.8s" duration="8s">
          &lt;/&gt;
        </FloatChip>
        <FloatChip className="bottom-[16%] left-[-6%]" delay="1.6s" duration="9s">
          <SparkIcon className="text-base" />
        </FloatChip>
        <FloatChip className="right-[6%] bottom-[2%]" delay="0.4s" duration="7.5s">
          #!
        </FloatChip>
      </div>

      {/* Signature line */}
      <p className="mt-8 text-center font-mono text-xs text-slate-400 lg:text-left">
        &ldquo;{profile.philosophy}&rdquo;
      </p>
    </div>
  );
}

function FloatChip({
  children,
  className,
  delay,
  duration,
}: {
  children: ReactNode;
  className: string;
  delay: string;
  duration: string;
}) {
  return (
    <span
      className={`absolute flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05] font-mono text-sm font-medium text-blue-200/80 backdrop-blur-sm ${className}`}
      style={{
        animation: `float ${duration} ease-in-out ${delay} infinite`,
      }}
    >
      {children}
    </span>
  );
}
