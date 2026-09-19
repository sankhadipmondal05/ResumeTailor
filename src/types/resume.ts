export type Resume = {
  id: string;
  name: string;
  type: "master" | "tailored";
  company?: string;
  jobTitle?: string;
  jobDescription?: string;
  contact: Contact;
  summary: string;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: SkillCategory[];
  certifications: Certification[];
  settings: ResumeSettings;
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  fullName: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
};

export type Project = {
  id: string;
  name: string;
  url?: string;
  technologies?: string[];
  bullets: string[];
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  cgpa?: string;
  details?: string;
};

export type SkillCategory = {
  id: string;
  name: string;
  skills: string[];
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
};

export type ResumeSettings = {
  fontFamily: "Inter" | "Aptos" | "Arial" | "Calibri" | "Georgia";
  fontSize: number;
  lineHeight: number;
  margin: number;
  sectionSpacing: number;
  letterSpacing?: number;
};

export type StorageSchema = {
  masterResume: Resume;
  tailoredResumes: Resume[];
  settings: {
    lastActiveResumeId?: string;
  };
};
