import type { Certificate } from '../types';

/**
 * CERTIFICATE DATA SOURCE
 * ======================
 * The portfolio deliberately ships with NO certificates, because no real
 * certificate file has been provided yet. Inventing an issuer, a date, or a
 * credential ID would be fabricating information, so the section renders an
 * empty state instead.
 *
 * ---------------------------------------------------------------------------
 * HOW TO ADD A CERTIFICATE
 * ---------------------------------------------------------------------------
 * 1. Put the file in `public/certificates/`
 *
 *      public/
 *      └── certificates/
 *          ├── certificate-1.jpg
 *          ├── certificate-2.png
 *          └── certificate-3.pdf
 *
 *    Supported by the viewer: .jpg  .jpeg  .png  .webp  .pdf
 *
 * 2. Add an object to the array below.
 *
 *    {
 *      id:       'certificate-1',              // unique key, kebab-case
 *      title:    'Certificate Name',            // required
 *      issuer:   'Issuing Institution',         // required
 *      date:     '2026',                        // e.g. '2026' or 'March 2026'
 *      category: 'Web Development',
 *      file:     '/certificates/certificate-1.jpg',   // required
 *      image:    '/certificates/certificate-1.jpg',   // optional preview image
 *      credentialId:  'ABC-123',                // optional
 *      credentialUrl: 'https://...',            // optional
 *    }
 *
 *    Only `title`, `issuer`, and `file` are required. If `image` is omitted the
 *    card falls back to a generated preview. If `file` is a PDF the viewer
 *    embeds it, and if the browser refuses to embed it the file opens in a new
 *    tab instead.
 *
 * 3. Save. No component changes are required.
 * ---------------------------------------------------------------------------
 */
export const certificates: Certificate[] = [];
