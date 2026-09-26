/** Small, dependency-free helpers shared across components. */

/** Joins class names, dropping falsy values. */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** "26 Sep 2026" — returns an em dash when the date is unknown. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '—';
  return DATE_FORMAT.format(parsed);
}

/** "2 days ago" style relative time, used in the GitHub Activity list. */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return '';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return '';

  const seconds = Math.round((Date.now() - parsed.getTime()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(seconds) >= secondsInUnit) {
      return formatter.format(-Math.round(seconds / secondsInUnit), unit);
    }
  }
  return formatter.format(-seconds, 'second');
}

/** Detects PDF files from the extension, regardless of casing. */
export function isPdf(file: string): boolean {
  return /\.pdf$/i.test(file);
}

export type CertificateKind = 'image' | 'pdf';

/** Image extensions the certificate viewer handles. */
export function certificateKind(file: string): CertificateKind {
  return isPdf(file) ? 'pdf' : 'image';
}

/** Pluralises a count, e.g. pluralise(1, 'repository') -> "1 repository". */
export function pluralise(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;
}

/** Strips the protocol and trailing slash for compact display. */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
