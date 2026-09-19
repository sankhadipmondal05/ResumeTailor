# Product Specification

## Navigation

- Dashboard
- My Resumes
- Master Resume
- Job Matches
- Settings

## Dashboard

Show:
- Master Resume status
- Number of tailored resumes
- Recently edited resumes
- Quick action: Tailor Resume
- Secondary action: Edit Master Resume

## Resume Architecture

One Master Resume is the source document. Tailored resumes are independent deep copies.

Example:
Master Resume
- Company A — Product Designer
- Company B — UI/UX Designer
- Company C — Product Designer

Editing a tailored resume must never modify the master.

## Sections

1. Contact
2. Summary
3. Experience
4. Projects
5. Education
6. Skills
7. Certifications

Optional sections may be enabled/disabled.

## Editor

Desktop uses Editor + Live Preview.

Experience fields:
- Company
- Role
- Location
- Start date
- End date
- Current toggle
- Description bullets

Support add/delete/reorder.

Projects:
- Project name
- URL
- Technologies
- Description/bullets

Skills use plain categories and text, not visual skill bars.

## Tailoring

Input:
- Company
- Job title
- Job description

Analyze the description locally. Show matched keywords, potentially missing keywords, related skills, and relevant resume sections.

Never invent experience. Suggestions must be grounded in existing user content.

## Export

Primary CTA: Download PDF
Secondary CTA: Print

Exported document must visually match the ATS-safe preview.
