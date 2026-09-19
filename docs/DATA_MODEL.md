# Data Model

```ts
type Resume = {
  id: string
  name: string
  type: "master" | "tailored"
  company?: string
  jobTitle?: string
  jobDescription?: string
  contact: Contact
  summary: string
  experience: Experience[]
  projects: Project[]
  education: Education[]
  skills: SkillCategory[]
  certifications: Certification[]
  settings: ResumeSettings
  createdAt: string
  updatedAt: string
}

type Contact = {
  fullName: string
  title?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
}

type Experience = {
  id: string
  company: string
  role: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  bullets: string[]
}

type Project = {
  id: string
  name: string
  url?: string
  technologies?: string[]
  bullets: string[]
}

type Education = {
  id: string
  institution: string
  degree: string
  field?: string
  location?: string
  startDate?: string
  endDate?: string
  gpa?: string
  details?: string
}

type SkillCategory = {
  id: string
  name: string
  skills: string[]
}

type Certification = {
  id: string
  name: string
  issuer: string
  date?: string
  url?: string
}

type ResumeSettings = {
  fontFamily: "Arial" | "Calibri" | "Georgia"
  fontSize: number
  lineHeight: number
  margin: number
  sectionSpacing: number
}

type JobMatch = {
  resumeId: string
  jobDescription: string
  matchedKeywords: string[]
  missingKeywords: string[]
  relatedKeywords: string[]
  analyzedAt: string
}
```
