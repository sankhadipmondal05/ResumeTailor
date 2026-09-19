# PDF Export Specification

PDF generation is critical.

## Requirements

- A4 portrait
- selectable text
- searchable text
- correct reading order
- no rasterized resume image

Never use HTML → screenshot → image → PDF.

## Preferred Architecture

Build the resume as semantic HTML and generate a text-based PDF.

Example structure:

<main>
  <section>
    <h1>Full Name</h1>
    <p>Contact information</p>
  </section>
  <section>
    <h2>SUMMARY</h2>
    <p>...</p>
  </section>
  <section>
    <h2>EXPERIENCE</h2>
    <article>
      <h3>Company — Role</h3>
      <p>Date | Location</p>
      <ul>
        <li>...</li>
      </ul>
    </article>
  </section>
</main>

## Page Breaks

Avoid splitting section headings from their first entries and company headings from bullets. Allow natural multi-page resumes. Do not shrink text excessively to force one page.

## Margins

Default 0.55–0.7 inch; allow adjustment.

## Filename

[Company] - [Job Title] - Resume.pdf

Fallback:
[Job Title] - Resume.pdf

Sanitize invalid characters.

## Verification

Before export verify:
- resume exists
- name exists
- at least one substantive section exists
- PDF generation succeeds

Also support window.print() with a matching print stylesheet.
