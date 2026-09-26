# Certificates

Drop certificate files in **this** folder, then register each one in
[`src/data/certificates.ts`](../../src/data/certificates.ts).

## Supported formats

| Extension | Preview | Viewer behaviour                                  |
| --------- | ------- | ------------------------------------------------- |
| `.jpg`     | image   | Full-size image inside a modal lightbox            |
| `.jpeg`    | image   | Full-size image inside a modal lightbox            |
| `.png`     | image   | Full-size image inside a modal lightbox            |
| `.webp`    | image   | Full-size image inside a modal lightbox            |
| `.pdf`     | file    | Embedded in a modal; opens in a new tab if the browser refuses to render it inline |

## Naming convention

Use a descriptive, stable name so the file keeps working if you add more later:

```text
certificate-1.jpg
certificate-2.png
certificate-3.pdf
```

## Important

The portfolio intentionally ships with **no certificate entries**. The
Certificates section renders an empty state until real files are added here, so
nothing on the site is fabricated.
