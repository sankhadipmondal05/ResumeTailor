# UI Specification

## Shell

Desktop:
- Sidebar 240px
- Topbar 64px
- Main content

## Sidebar

Logo: ResumeTailor

Navigation:
- Dashboard
- My Resumes
- Master Resume
- Job Matches

Bottom:
- Settings

Active item uses a subtle accent background.

## Dashboard

Header:
Good evening

Subheading:
Tailor your resume for your next application.

Primary:
Tailor Resume

Secondary:
Edit Master Resume

Three compact statistics:
- Master Resume
- Tailored Resumes
- Recent Match

Avoid excessive cards.

## Resume List

Show:
- Company
- Job title
- Last updated
- Match status if available

Actions:
Edit, Duplicate, Delete, Download

## Editor

Header:
- Resume name
- Save status
- Preview
- Download PDF

Main:
Editor | Preview

Section navigation:
Contact
Summary
Experience
Projects
Education
Skills
Certifications

## Preview

A4 document centered on a light-gray workspace.

## Job Match

Header:
Tailor your resume

Fields:
Company
Job title

Large textarea:
Paste the job description here...

CTA:
Analyze Job Description

Results:
- Job Description Match
- Matched keywords
- Potentially missing keywords
- Relevant resume sections
- Suggested edits

Do not make an arbitrary ATS score the central UX.

## Empty States

Master:
Build your master resume once. Then tailor it for every application.

Tailored:
Your tailored resumes will appear here.

## Toasts

- Resume saved
- Resume duplicated
- PDF exported
- Job description analyzed
- Changes saved

## Modals

Use only for:
- delete confirmation
- create tailored resume
- small settings

Do not put the whole editor inside a modal.
