import { useEffect, useState } from 'react';
import { GITHUB_URL, profile } from '../data/profile';
import { CloseIcon, GithubIcon, MenuIcon } from './icons';
import { cx } from '../lib/utils';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'projects', label: 'Projects' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('home');

  // Transparent over the hero, solid + blurred once scrolled past it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const handleNavigate = () => setOpen(false);

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300',
        scrolled || open
          ? 'border-b border-line/80 bg-white/85 shadow-[0_1px_16px_rgba(15,23,42,0.06)] backdrop-blur-lg'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Main navigation"
        className="container-page flex h-16 items-center justify-between gap-4 md:h-18"
      >
        {/* Brand */}
        <a
          href="#home"
          onClick={handleNavigate}
          className="group flex items-center gap-2.5 rounded-lg"
          aria-label={`${profile.name} — back to top`}
        >
          <span
            className={cx(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-bold transition-colors',
              scrolled || open
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white ring-1 ring-white/25 group-hover:bg-white/20',
            )}
          >
            {profile.initials}
          </span>
          <span
            className={cx(
              'hidden text-[0.9375rem] font-bold tracking-tight transition-colors sm:block',
              scrolled || open ? 'text-navy-900' : 'text-white',
            )}
          >
            Ahmad Ragiel
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cx(
                    'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    scrolled
                      ? isActive
                        ? 'text-blue-700'
                        : 'text-muted hover:text-navy-900'
                      : isActive
                        ? 'text-white'
                        : 'text-slate-300 hover:text-white',
                  )}
                >
                  {link.label}
                  <span
                    className={cx(
                      'absolute inset-x-3 -bottom-0.5 h-px origin-left transition-transform duration-300',
                      scrolled ? 'bg-blue-600' : 'bg-blue-300',
                      isActive ? 'scale-x-100' : 'scale-x-0',
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cx('btn !px-3.5 !py-2 !text-[0.8125rem]', scrolled ? 'btn-primary' : 'btn-ghost-light')}
          >
            <GithubIcon className="text-base" />
            <span className="hidden sm:inline">View GitHub</span>
            <span className="sm:hidden">GitHub</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={cx(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors lg:hidden',
              scrolled || open
                ? 'border-line text-navy-900 hover:bg-canvas'
                : 'border-white/25 text-white hover:bg-white/10',
            )}
          >
            {open ? <CloseIcon className="text-lg" /> : <MenuIcon className="text-lg" />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="animate-modal-in border-t border-line bg-white lg:hidden"
      >
        <ul className="container-page flex flex-col py-3">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={handleNavigate}
                aria-current={active === link.id ? 'true' : undefined}
                className={cx(
                  'flex items-center justify-between rounded-lg px-2 py-3 text-[0.9375rem] font-medium transition-colors',
                  active === link.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-navy-900 hover:bg-canvas',
                )}
              >
                {link.label}
                {active === link.id ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
