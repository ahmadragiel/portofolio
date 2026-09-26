import { useRef, useState } from 'react';
import type { Certificate } from '../types';
import { useModalBehaviour } from '../hooks/useModalBehaviour';
import { certificates } from '../data/certificates';
import { certificateKind, prettyUrl } from '../lib/utils';
import { Section } from './Section';
import {
  DocumentIcon,
  DownloadIcon,
  ExternalLinkIcon,
  EyeIcon,
  ImageIcon,
  CloseIcon,
} from './icons';

export function Certificates() {
  const [active, setActive] = useState<Certificate | null>(null);

  const hasCertificates = certificates.length > 0;

  return (
    <Section
      id="certificates"
      eyebrow="Credentials"
      title="Certificates & Certifications"
      lead={
        hasCertificates
          ? 'Certificates I have completed, with the issuing organisation and date for each one.'
          : 'This section is ready and waiting. Certificates will be added here as soon as I have them.'
      }
      tone="soft"
      aside={
        hasCertificates ? (
          <p className="text-xs text-faint">
            {certificates.length} certificate{certificates.length === 1 ? '' : 's'}
          </p>
        ) : null
      }
    >
      {hasCertificates ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onView={() => setActive(certificate)}
            />
          ))}
        </ul>
      ) : (
        <EmptyCertificates />
      )}

      <CertificateModal certificate={active} onClose={() => setActive(null)} />
    </Section>
  );
}

/* ==========================================================================
   Card
   ========================================================================== */
function CertificateCard({
  certificate,
  onView,
}: {
  certificate: Certificate;
  onView: () => void;
}) {
  const isPdf = certificateKind(certificate.file) === 'pdf';

  return (
    <li className="card accent-top group flex flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[var(--shadow-lift)]">
      {/* Preview */}
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-canvas">
        {certificate.image ? (
          <CertificatePreview certificate={certificate} />
        ) : (
          <FilePlaceholder isPdf={isPdf} />
        )}

        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-blue-700 backdrop-blur-sm">
          {isPdf ? (
            <DocumentIcon className="text-[0.8125rem]" />
          ) : (
            <ImageIcon className="text-[0.8125rem]" />
          )}
          {isPdf ? 'PDF' : 'Image'}
        </span>
      </div>

      {/* Metadata */}
      <div className="flex flex-1 flex-col p-5">
        {certificate.category ? (
          <span className="badge badge-accent self-start">{certificate.category}</span>
        ) : null}

        <h3 className="mt-3 text-[1.0625rem] leading-snug font-bold text-navy-900">
          {certificate.title}
        </h3>

        <p className="mt-1.5 text-sm text-muted">{certificate.issuer}</p>

        <dl className="mt-4 space-y-1.5 text-xs text-faint">
          {certificate.date ? (
            <div className="flex gap-2">
              <dt className="font-medium">Date:</dt>
              <dd>{certificate.date}</dd>
            </div>
          ) : null}
          {certificate.credentialId ? (
            <div className="flex gap-2">
              <dt className="font-medium">Credential ID:</dt>
              <dd className="font-mono">{certificate.credentialId}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-5 flex flex-col gap-2 border-t border-line-soft pt-4">
          <button type="button" onClick={onView} className="btn btn-primary w-full !py-2 !text-sm">
            <EyeIcon className="text-base" />
            View Certificate
          </button>

          {certificate.credentialUrl ? (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary w-full !py-2 !text-sm"
            >
              <ExternalLinkIcon className="text-base" />
              Verify Credential
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/** Image preview with a graceful fallback if the file is missing. */
function CertificatePreview({ certificate }: { certificate: Certificate }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <FilePlaceholder isPdf={certificateKind(certificate.file) === 'pdf'} />;
  }

  return (
    <img
      src={certificate.image ?? certificate.file}
      alt={`Preview of ${certificate.title}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
    />
  );
}

function FilePlaceholder({ isPdf }: { isPdf: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-50 to-blue-100/60 text-blue-600">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl border border-blue-200 bg-white text-2xl shadow-[var(--shadow-soft)]">
        {isPdf ? <DocumentIcon /> : <ImageIcon />}
      </span>
      <p className="px-6 text-center text-xs leading-relaxed text-blue-800/70">
        {isPdf
          ? 'PDF certificate — no preview image provided yet'
          : 'Certificate image will appear here once the file is added'}
      </p>
    </div>
  );
}

/* ==========================================================================
   Empty state
   ========================================================================== */
function EmptyCertificates() {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-panel)] border border-dashed border-blue-200 bg-gradient-to-br from-white to-blue-100/40 px-6 py-16 text-center sm:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent)',
        }}
      />

      <div className="relative mx-auto max-w-lg">
        <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-white text-3xl text-blue-600 shadow-[var(--shadow-soft)]">
          <DocumentIcon />
        </span>

        <h3 className="mt-6 text-lg font-bold text-navy-900">
          Certificates will be added soon.
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          I would rather leave this section empty than publish a certificate I cannot verify.
          Each entry will include the certificate preview, the issuing organisation, the date, and
          a link to the credential where one exists.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <span className="badge">JPG</span>
          <span className="badge">JPEG</span>
          <span className="badge">PNG</span>
          <span className="badge">WEBP</span>
          <span className="badge">PDF</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Modal viewer
   ========================================================================== */
export function CertificateModal({
  certificate,
  onClose,
}: {
  certificate: Certificate | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  useModalBehaviour(Boolean(certificate), onClose, dialogRef);

  if (!certificate) return null;

  const isPdf = certificateKind(certificate.file) === 'pdf';
  const source = isPdf ? certificate.file : (certificate.image ?? certificate.file);

  return (
    <div
      className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-navy-900/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-modal-title"
        tabIndex={-1}
        className="animate-modal-in flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-12px_rgba(11,18,32,0.45)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2
              id="certificate-modal-title"
              className="truncate text-base font-bold text-navy-900 sm:text-lg"
            >
              {certificate.title}
            </h2>
            <p className="mt-0.5 truncate text-xs text-muted">
              {certificate.issuer}
              {certificate.date ? ` · ${certificate.date}` : ''}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={certificate.file}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary !px-3 !py-2 !text-xs"
              aria-label={`Open ${certificate.title} in a new tab`}
            >
              <DownloadIcon className="text-base" />
              <span className="hidden sm:inline">Open</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close certificate viewer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-blue-300 hover:text-blue-700"
            >
              <CloseIcon className="text-lg" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-canvas p-4 sm:p-6">
          {isPdf ? (
            /*
             * PDFs are embedded so the viewer stays in place. If the browser has no
             * inline PDF support, the iframe is blocked and we show a clear
             * "open in a new tab" fallback rather than an empty frame.
             */
            <div className="flex h-full min-h-[60vh] flex-col gap-3">
              <object
                data={source}
                type="application/pdf"
                className="w-full flex-1 rounded-xl border border-line bg-white"
                aria-label={`PDF document: ${certificate.title}`}
              >
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
                  <DocumentIcon className="text-4xl text-blue-300" />
                  <p className="text-sm text-muted">
                    This browser cannot display the PDF inline.
                  </p>
                  <a
                    href={certificate.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <ExternalLinkIcon className="text-lg" />
                    Open PDF in a new tab
                  </a>
                </div>
              </object>

              <p className="text-center text-xs text-faint">
                Having trouble?{' '}
                <a
                  href={certificate.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-700 underline underline-offset-2"
                >
                  Open {prettyUrl(certificate.file)} in a new tab
                </a>
              </p>
            </div>
          ) : imageFailed ? (
            <MissingAsset file={certificate.file} />
          ) : (
            <img
              src={source}
              alt={`${certificate.title} — certificate issued by ${certificate.issuer}`}
              onError={() => setImageFailed(true)}
              className="mx-auto max-h-[68vh] w-auto rounded-xl border border-line bg-white object-contain shadow-[var(--shadow-soft)]"
            />
          )}
        </div>

        {/* Footer */}
        {certificate.credentialUrl || certificate.credentialId ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5 sm:px-6">
            {certificate.credentialId ? (
              <p className="font-mono text-xs text-faint">
                Credential ID: {certificate.credentialId}
              </p>
            ) : (
              <span />
            )}
            {certificate.credentialUrl ? (
              <a
                href={certificate.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-700 underline underline-offset-2"
              >
                Verify credential
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MissingAsset({ file }: { file: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center"
    >
      <DocumentIcon className="text-4xl text-slate-300" />
      <div>
        <p className="text-sm font-semibold text-navy-900">Certificate file not found</p>
        <p className="mt-1.5 text-xs text-muted">
          Expected the file at <code className="font-mono text-blue-700">{file}</code>
        </p>
      </div>
      <p className="max-w-sm text-xs leading-relaxed text-faint">
        Drop the file into <code className="font-mono">public/certificates/</code> and make sure
        the path in <code className="font-mono">src/data/certificates.ts</code> matches.
      </p>
    </div>
  );
}
