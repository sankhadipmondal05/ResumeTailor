# Feature Specification

## Master Resume

Create, edit, reorder sections, autosave, preview, export.

## Contact

- Full name
- Professional title
- Email
- Phone
- Location
- LinkedIn
- GitHub
- Portfolio

Only filled fields appear in the final resume.

## Summary

Plain text with a recommended 500-character limit and character count.

## Experience

Multiple entries with:
- company
- title
- location
- start date
- end date
- current
- bullets

Support add/edit/delete/reorder.

## Education

- institution
- degree
- field
- location
- dates
- optional GPA
- optional details

## Projects

- name
- URL
- technologies
- bullets

## Skills

Configurable plain-text categories such as Design, Development, Tools, Other.

## Certifications

- name
- issuer
- date
- optional URL

## Tailored Resume

Create a deep copy of the master resume and store:
- company
- job title
- job description
- created/updated dates
- resume content
- match analysis

## Keyword Extraction

Identify likely:
- technical skills
- software/tools
- methodologies
- job titles
- industry terminology
- soft skills
- certifications

## Matching

Normalize case, punctuation, whitespace, and common abbreviations. Recognize common equivalents such as UI/UX ↔ UI UX and UX ↔ User Experience where appropriate.

## Suggestions

Suggestions must be grounded in existing resume content. Never fabricate qualifications, metrics, experience, or years.

## Template

MVP includes one template: ATS Standard.

Allowed controls:
- font
- font size
- line spacing
- margins
- section spacing

Avoid columns and graphics.

## Export

A4 PDF. Filename:
Company - Job Title - Resume.pdf
Sanitize invalid filesystem characters.
