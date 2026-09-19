# Antigravity Build Instructions

You are building ResumeTailor, an ATS-safe resume tailoring web application.

Read these files before implementing:
- README.md
- PRODUCT.md
- DESIGN_SYSTEM.md
- TECHNICAL_SPEC.md
- FEATURES.md
- ATS_RULES.md
- DATA_MODEL.md
- PDF_EXPORT.md
- UI_SPEC.md
- IMPLEMENTATION.md

These documents are the source of truth.

## Priority

1. ATS safety
2. Functional correctness
3. Data integrity
4. Usability
5. Visual polish

## Implementation

Build incrementally. Do not create one giant component. Use reusable components and strong TypeScript types.

## Design

Use MUI and the defined light theme. Do not implement dark mode. Do not introduce Tailwind or unnecessary UI libraries. Avoid excessive gradients, glassmorphism, decorative illustrations, oversized typography, and marketing-landing-page styling.

## Resume

Keep the resume renderer separate from editor UI.

The resume must be:
- single column
- text based
- A4
- selectable
- searchable
- predictable

Never render the resume as a screenshot or canvas image.

## Data

Master and tailored resumes must be independent deep copies.

## Content

Never invent jobs, skills, qualifications, achievements, metrics, certifications, education, or experience. Keyword analysis may identify missing terms but cannot fabricate evidence.

## Responsive

Desktop is primary. Mobile must remain functional. On small screens show editor first and preview below. Keep the resume itself A4.

## Accessibility

Use semantic HTML, labels, keyboard navigation, visible focus states, and sufficient contrast.

## Error Handling

Never let errors crash the entire application. Show useful user-facing messages.

## Development Process

1. Inspect the existing project and dependencies.
2. Preserve useful existing configuration.
3. Install only required dependencies.
4. Implement foundation.
5. Implement data layer.
6. Implement editor.
7. Implement preview.
8. Implement tailoring.
9. Implement matching.
10. Implement PDF export.
11. Test.
12. Polish.

After every major phase, verify the app builds and fix errors before continuing.

## Definition of Done

A user can:
1. Open the app.
2. Create a master resume.
3. Fill in information.
4. Add jobs/projects/education.
5. See a live ATS-safe preview.
6. Save automatically.
7. Paste a job description.
8. Analyze it locally.
9. See matched and potentially missing terms.
10. Create a tailored copy.
11. Edit the tailored copy.
12. Download a text-based A4 PDF.
13. Refresh the browser.
14. Continue without losing data.
