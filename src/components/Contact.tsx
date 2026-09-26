import { contact, GITHUB_URL, profile, socialLinks } from '../data/profile';
import { Section } from './Section';
import { useRevealGroup } from '../hooks/useReveal';
import { SOCIAL_ICONS, ArrowUpRightIcon, MailIcon, PinIcon } from './icons';
import { cx } from '../lib/utils';

export function Contact() {
  const { ref, visible, delay } = useRevealGroup<HTMLDivElement>();

  return (
    <Section
      id="contact"
      eyebrow={contact.eyebrow}
      title={contact.heading}
      lead={contact.body}
      tone="white"
    >
      <div ref={ref} className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        {/* ---------------- Left: primary actions ---------------- */}
        <div
          className={cx(
            'relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-navy-900 p-8 sm:p-10',
            visible ? 'reveal reveal-visible' : 'reveal',
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_65%_55%_at_25%_15%,rgba(37,99,235,0.32),transparent_62%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 30% 30%, #000, transparent)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 60% at 30% 30%, #000, transparent)',
            }}
          />

          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pr-4 pl-2.5 text-xs font-medium text-slate-200 backdrop-blur-sm">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.status}
          </span>

          <h3 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl">
            Have something interesting in mind?
          </h3>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            I am actively looking for an internship in web or data development, and I am always
            happy to talk about a collaboration or a problem worth digging into. The fastest way
            to reach me is email.
          </p>

          {/* Email is the primary action, rendered as a real mailto link. */}
          <a
            href={`mailto:${profile.email}`}
            className="btn btn-primary mt-8 w-full !py-3 sm:w-auto sm:!px-6"
          >
            <MailIcon className="text-lg" />
            Email Me
          </a>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-light mt-3 w-full !py-3 sm:w-auto sm:!px-6"
          >
            View GitHub
            <ArrowUpRightIcon className="text-base opacity-70" />
          </a>

          <p className="mt-7 flex items-center gap-2 border-t border-white/10 pt-5 font-mono text-xs text-slate-400">
            <MailIcon className="text-sm" />
            {profile.email}
          </p>
        </div>

        {/* ---------------- Right: social links ---------------- */}
        <div className="space-y-3">
          {socialLinks.map((link, index) => {
            const Icon = SOCIAL_ICONS[link.label] ?? MailIcon;
            const isMail = link.label === 'Email';
            return (
              <a
                key={link.label}
                href={link.href}
                {...(isMail
                  ? {}
                  : { target: '_blank', rel: 'noopener noreferrer' })}
                style={delay(index)}
                className={cx(
                  'card group flex items-center gap-4 p-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]',
                  visible ? 'reveal reveal-visible' : 'reveal',
                )}
                aria-label={
                  isMail
                    ? `Send an email to ${profile.email}`
                    : `${link.label} profile — ${link.handle} (opens in a new tab)`
                }
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-100 text-lg text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Icon />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-navy-900">{link.label}</span>
                  <span className="mt-0.5 block truncate font-mono text-xs text-muted">
                    {link.handle}
                  </span>
                </span>

                {isMail ? (
                  <MailIcon className="shrink-0 text-lg text-faint transition-colors group-hover:text-blue-600" />
                ) : (
                  <ArrowUpRightIcon className="shrink-0 text-lg text-faint transition-colors group-hover:text-blue-600" />
                )}
              </a>
            );
          })}

          <p className="flex items-start gap-2.5 rounded-xl border border-dashed border-line bg-canvas px-4 py-3.5 text-xs leading-relaxed text-muted">
            <PinIcon className="mt-px shrink-0 text-base text-blue-600" />
            <span>
              Based in {profile.location}. I reply to email and messages, and I am happy to work
              remotely.
            </span>
          </p>

          {/* Only channels that are genuinely published are listed above. */}
          <p className="text-xs text-faint">
            These are the only channels I publish. No accounts are listed here unless I actually
            use them, and the email address is the fastest way to reach me.
          </p>
        </div>
      </div>
    </Section>
  );
}
