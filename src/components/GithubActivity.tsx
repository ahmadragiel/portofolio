import { githubProfile, githubStats, recentProjects } from '../lib/projects';
import { GITHUB_USERNAME } from '../data/profile';
import { Section } from './Section';
import { useRevealGroup } from '../hooks/useReveal';
import {
  ArrowUpRightIcon,
  ClockIcon,
  CodeIcon,
  ExternalLinkIcon,
  GithubIcon,
  RepoIcon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from './icons';
import { cx, formatDate, formatRelative, prettyUrl, pluralise } from '../lib/utils';

export function GithubActivity() {
  const { ref, visible, delay } = useRevealGroup<HTMLDivElement>();

  /*
   * The contribution heatmap is intentionally NOT rendered.
   * GitHub only exposes contribution data through an authenticated endpoint, and
   * a third-party generated image would be both unreliable and outside my control.
   * Showing an invented graph would be worse than showing nothing, so the section
   * links to the real graph on GitHub instead.
   */

  const stats = [
    {
      label: 'Public Repositories',
      value: githubStats.publicRepositories,
      icon: RepoIcon,
      note: `${githubStats.listedRepositories} listed in this portfolio`,
    },
    {
      label: 'Followers',
      value: githubStats.followers,
      icon: UsersIcon,
      note: 'From the public GitHub profile',
    },
    {
      label: 'Following',
      value: githubStats.following,
      icon: UserIcon,
      note: 'From the public GitHub profile',
    },
    {
      label: 'Total Stars',
      value: githubStats.totalStars,
      icon: StarIcon,
      note: `Across all ${githubStats.listedRepositories} listed repositories`,
    },
  ];

  return (
    <Section
      id="github"
      eyebrow="Open Source"
      title="GitHub Activity"
      lead={`Live figures for @${GITHUB_USERNAME}, read from the GitHub API when this site was built.`}
      tone="dark"
      aside={
        <a
          href={githubProfile.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost-light !py-2 !text-sm"
        >
          <GithubIcon className="text-base" />
          @{GITHUB_USERNAME}
          <ArrowUpRightIcon className="text-sm opacity-70" />
        </a>
      }
    >
      <div ref={ref} className="space-y-10">
        {/* ------------------------- Stat tiles ------------------------- */}
        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={delay(index)}
                className={cx(
                  'rounded-xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:border-blue-400/30 hover:bg-white/[0.07]',
                  visible ? 'reveal reveal-visible' : 'reveal',
                )}
              >
                <Icon className="text-xl text-blue-400" />
                <dd className="mt-3 text-3xl font-extrabold tracking-tight text-white tabular-nums sm:text-4xl">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-sm font-semibold text-slate-200">{stat.label}</dt>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{stat.note}</p>
              </div>
            );
          })}
        </dl>

        {/* ------------------------- Recent repositories ------------------------- */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
          <div
            className={cx(
              'rounded-xl border border-white/10 bg-white/[0.03]',
              visible ? 'reveal reveal-visible' : 'reveal',
            )}
          >
            <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
              <ClockIcon className="text-base text-blue-400" />
              <h3 className="text-sm font-bold text-white">Recently Updated Repositories</h3>
            </div>

            {recentProjects.length > 0 ? (
              <ul className="divide-y divide-white/[0.07]">
                {recentProjects.map((project, index) => (
                  <li key={project.id} style={delay(index)}>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-100 transition-colors group-hover:text-blue-300">
                          {project.title}
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                          {project.language ? (
                            <span className="inline-flex items-center gap-1.5">
                              <CodeIcon className="text-[0.8125rem]" />
                              {project.language}
                            </span>
                          ) : null}
                          <span title={formatDate(project.updatedAt)}>
                            Updated {formatRelative(project.updatedAt) || formatDate(project.updatedAt)}
                          </span>
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <StarIcon className="text-[0.8125rem]" />
                          {project.stars}
                        </span>
                        <ExternalLinkIcon className="text-base opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <GitHubEmptyState />
            )}
          </div>

          {/* ------------------------- Side panel ------------------------- */}
          <div className="space-y-4">
            {/* Honest note about the contribution graph. */}
            <div
              className={cx(
                'rounded-xl border border-white/10 bg-white/[0.03] p-5',
                visible ? 'reveal reveal-visible' : 'reveal',
              )}
            >
              <h3 className="text-sm font-bold text-white">Contribution Graph</h3>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                I have deliberately not embedded a contribution heatmap here. GitHub only exposes
                that data through an authenticated endpoint, and rendering a generated or estimated
                graph would mean publishing numbers I cannot verify.
              </p>
              <a
                href={`${githubProfile.htmlUrl}?tab=overview`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 underline underline-offset-4 transition-colors hover:text-blue-200"
              >
                View the real graph on GitHub
                <ArrowUpRightIcon className="text-sm" />
              </a>
            </div>

            {/* Snapshot provenance */}
            <div
              className={cx(
                'rounded-xl border border-white/10 bg-white/[0.03] p-5',
                visible ? 'reveal reveal-visible' : 'reveal',
              )}
            >
              <h3 className="text-sm font-bold text-white">Data Source</h3>
              <dl className="mt-3 space-y-2.5 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Source</dt>
                  <dd className="text-right font-mono text-slate-300">api.github.com</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Last synced</dt>
                  <dd className="text-right font-mono text-slate-300">
                    {formatDate(githubStats.fetchedAt)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Member since</dt>
                  <dd className="text-right font-mono text-slate-300">
                    {formatDate(githubStats.accountCreatedAt)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Live demos verified</dt>
                  <dd className="text-right font-mono text-slate-300">
                    {githubStats.liveDemos}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-400">Profile</dt>
                  <dd className="truncate text-right font-mono text-slate-300">
                    {prettyUrl(githubProfile.htmlUrl)}
                  </dd>
                </div>
              </dl>

              <p className="mt-4 border-t border-white/10 pt-3.5 text-[0.6875rem] leading-relaxed text-slate-400">
                {pluralise(githubStats.listedRepositories, 'repository', 'repositories')} listed
                here, synced at build time. The page makes no GitHub API calls at runtime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function GitHubEmptyState() {
  return (
    <div className="px-5 py-12 text-center">
      <p className="text-sm font-semibold text-slate-200">
        Unable to load live GitHub activity.
      </p>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-slate-400">
        Run <code className="font-mono text-blue-300">npm run sync:github</code> to refresh the
        snapshot, or head straight to the profile.
      </p>
      <a
        href={githubProfile.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost-light mt-5 !py-2 !text-sm"
      >
        <GithubIcon className="text-base" />
        View GitHub Profile
      </a>
    </div>
  );
}
