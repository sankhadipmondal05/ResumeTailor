# Implementation Instructions

## Phase 1 — Foundation

Create:
- Vite React TypeScript app
- MUI
- React Router
- theme
- application shell
- sidebar
- topbar
- routes

Light mode only.

## Phase 2 — Data

Implement:
- typed Resume models
- localStorage service
- CRUD
- default master resume
- autosave

Use a storage abstraction.

## Phase 3 — Editor

Implement:
- Contact
- Summary
- Experience
- Projects
- Education
- Skills
- Certifications
- add/edit/delete/reorder

## Phase 4 — Preview

Create a dedicated ATS resume renderer. Keep it separate from editor UI. Render a clean A4 document.

## Phase 5 — Job Matching

Local pipeline:
jobDescription → normalize → tokenize → identify phrases → classify → compare against resume → matched/missing/related

Include a small extendable internal dictionary of common design, development, methodology, and job terminology.

## Phase 6 — Tailoring

Tailor Resume → Company/Title/Description → deep-copy master → analyze → open editor.

## Phase 7 — PDF

Implement Download PDF and Print Resume. Test selectable text, search, reading order, multi-page resumes, and layout.

## Phase 8 — Validation

Test:
1. empty resume
2. long resume
3. multiple experiences
4. multiple projects
5. long bullets
6. two-page resume
7. missing optional fields
8. PDF text selection
9. PDF text search
10. refresh persistence
11. duplicate independence
12. delete
13. tailoring

## Engineering Rule

Do not implement features merely because they look impressive. Every feature must support creating, tailoring, checking relevance, editing, previewing, or exporting.

## Future Extension Points

Architecture may later support cloud sync, authentication, AI-assisted rewriting, multiple templates, cover letters, version history, analytics, and browser extensions. Do not implement these now.
