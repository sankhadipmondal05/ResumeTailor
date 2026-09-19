# Technical Specification

## Stack

React
TypeScript
Vite
MUI
React Router

## Structure

src/
- components/layout
- components/editor
- components/resume
- components/matching
- components/common
- pages/Dashboard
- pages/ResumeEditor
- pages/ResumeList
- pages/JobMatch
- pages/Settings
- hooks
- services/storage
- services/parser
- services/matcher
- services/pdf
- types
- utils
- theme
- App.tsx

## State

Use React state/context. Do not add Redux unless genuinely necessary.

## Persistence

Use localStorage through a storage abstraction. Suggested key:
resumetailor_data

Schema:
{
  masterResume: Resume,
  tailoredResumes: ResumeVersion[],
  settings: Settings
}

Use stable IDs. Deep-clone nested objects when duplicating.

## Auto-save

Debounce persistence by 300–500ms. Show Saving... / Saved.

## Routes

/ → Dashboard
/resumes → Resume list
/resumes/master → Master editor
/resumes/:id → Tailored editor
/match → Job matching
/settings → Settings

## No Backend

Do not create Express, MongoDB, authentication, or an API layer for MVP.

## No External APIs

Keyword matching must work locally.

## Performance

Keep the resume preview responsive. Debounce persistence and keyword analysis. Separate business logic from presentation where practical.

## Error Handling

Handle malformed localStorage, empty resumes, invalid data, and PDF failures without crashing the application.
