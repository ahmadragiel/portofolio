import { GITHUB_URL, profile, socialLinks } from '../data/profile';
import { ArrowUpIcon, GithubIcon, SOCIAL_ICONS } from './icons';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'projects', label: 'Projects' },
  { id: 'github', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="container-page py-12 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Identity */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 font-mono text-sm font-bold text-white">
                {profile.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-navy-900">{profile.name}</p>
                <p className="text-xs text-muted">{profile.role}</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted">{profile.tagline}</p>

            <a
              href={`mailto:${profile.email}`}
              className="mt-4 inline-block break-all font-mono text-xs text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800"
            >
              {profile.email}
            </a>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h2 className="font-mono text-[0.6875rem] font-medium tracking-wider text-faint uppercase">
              Navigate
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="text-sm text-muted transition-colors hover:text-blue-700"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h2 className="font-mono text-[0.6875rem] font-medium tracking-wider text-faint uppercase">
              Elsewhere
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {socialLinks
                .filter((link) => link.label !== 'Email')
                .map((link) => {
                  const Icon = SOCIAL_ICONS[link.label] ?? GithubIcon;
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label} — ${link.handle} (opens in a new tab)`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-base text-muted transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
                      >
                        <Icon />
                      </a>
                    </li>
                  );
                })}
            </ul>

            <a
              href="#home"
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-blue-700"
            >
              <ArrowUpIcon className="text-sm" />
              Back to top
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-7 sm:flex-row">
          <p className="text-xs text-muted">
            &copy; {year} {profile.name}
          </p>
          <p className="text-xs text-faint">
            {profile.locationFlag} {profile.location} &middot;{' '}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-blue-700"
            >
              Built from my GitHub data
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
