import { Resume, StorageSchema } from "../../types/resume";
import { defaultMasterResume } from "./defaultData";

const STORAGE_KEY = "resumetailor_data";

export const storageService = {
  loadData(): StorageSchema {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initialData: StorageSchema = {
          masterResume: defaultMasterResume,
          tailoredResumes: [],
          settings: {
            lastActiveResumeId: defaultMasterResume.id
          }
        };
        this.saveData(initialData);
        return initialData;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.masterResume || !parsed.tailoredResumes) {
        throw new Error("Invalid schema");
      }
      let changed = false;
      // Check if existing stored masterResume contains legacy placeholder data (e.g. Alex Morgan or PulseStream)
      const hasOldPlaceholder =
        parsed.masterResume.contact?.fullName?.includes("Alex") ||
        JSON.stringify(parsed.masterResume).includes("PulseStream") ||
        JSON.stringify(parsed.masterResume).includes("alexmorgan");

      if (hasOldPlaceholder) {
        parsed.masterResume = JSON.parse(JSON.stringify(defaultMasterResume));
        changed = true;
      }

      // Ensure masterResume always contains Sankhadip Mondal's contact info
      if (
        parsed.masterResume.contact?.email !== defaultMasterResume.contact.email ||
        parsed.masterResume.contact?.phone !== defaultMasterResume.contact.phone ||
        parsed.masterResume.contact?.fullName !== defaultMasterResume.contact.fullName
      ) {
        parsed.masterResume.contact = {
          ...parsed.masterResume.contact,
          ...defaultMasterResume.contact
        };
        changed = true;
      }

      // Sanitize education: remove location & details, ensure graduation year is not a range
      const sanitizeEducation = (edList: typeof defaultMasterResume.education) => {
        return (edList || []).map((ed) => ({
          ...ed,
          location: "",
          details: "",
          startDate: "",
          endDate: ed.endDate ? ed.endDate.replace(/.*[-–]\s*/, "").trim() : (ed.startDate || "")
        }));
      };

      if (parsed.masterResume.education) {
        parsed.masterResume.education = sanitizeEducation(parsed.masterResume.education);
        changed = true;
      }

      // If masterResume has customized skills or projects, ensure defaultData stays in sync
      if (parsed.masterResume.skills && parsed.masterResume.skills.length > 0) {
        defaultMasterResume.skills = JSON.parse(JSON.stringify(parsed.masterResume.skills));
      }
      if (parsed.masterResume.projects && parsed.masterResume.projects.length > 0) {
        parsed.masterResume.projects = parsed.masterResume.projects.map((p: Resume["projects"][number]) => ({
          ...p,
          name: p.name ? p.name.replace(/[—–]/g, "-") : p.name
        }));
        defaultMasterResume.projects = JSON.parse(JSON.stringify(parsed.masterResume.projects));
        changed = true;
      }
      if (parsed.masterResume.experience && parsed.masterResume.experience.length > 0) {
        parsed.masterResume.experience = parsed.masterResume.experience.map((e: Resume["experience"][number]) => ({
          ...e,
          company: e.company ? e.company.replace(/[—–]/g, "-") : e.company,
          role: e.role ? e.role.replace(/[—–]/g, "-") : e.role
        }));
        changed = true;
      }
      if (parsed.masterResume.education && parsed.masterResume.education.length > 0) {
        defaultMasterResume.education = JSON.parse(JSON.stringify(parsed.masterResume.education));
      }

      // Ensure masterResume has standard typography defaults
      if (
        !parsed.masterResume.settings ||
        parsed.masterResume.settings.fontFamily === "Arial" && parsed.masterResume.settings.fontSize === 9.5
      ) {
        parsed.masterResume.settings = { ...defaultMasterResume.settings };
        changed = true;
      }

      if (Array.isArray(parsed.tailoredResumes)) {
        parsed.tailoredResumes = parsed.tailoredResumes.map((tr: Resume) => ({
          ...tr,
          education: sanitizeEducation(tr.education)
        }));
        changed = true;
      }

      if (changed) {
        this.saveData(parsed);
      }
      return parsed;
    } catch (e) {
      console.error("Failed to load data from localStorage, falling back to defaults", e);
      const fallback: StorageSchema = {
        masterResume: defaultMasterResume,
        tailoredResumes: [],
        settings: {
          lastActiveResumeId: defaultMasterResume.id
        }
      };
      return fallback;
    }
  },

  saveData(data: StorageSchema): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save data to localStorage", e);
    }
  },

  getMasterResume(): Resume {
    const data = this.loadData();
    return data.masterResume;
  },

  saveMasterResume(resume: Resume): void {
    const data = this.loadData();
    data.masterResume = {
      ...resume,
      type: "master",
      updatedAt: new Date().toISOString()
    };
    if (resume.skills && resume.skills.length > 0) {
      defaultMasterResume.skills = JSON.parse(JSON.stringify(resume.skills));
    }
    if (resume.projects && resume.projects.length > 0) {
      defaultMasterResume.projects = JSON.parse(JSON.stringify(resume.projects));
    }
    if (resume.education && resume.education.length > 0) {
      defaultMasterResume.education = JSON.parse(JSON.stringify(resume.education));
    }
    this.saveData(data);
  },

  getResumeById(id: string): Resume | null {
    const data = this.loadData();
    if (data.masterResume.id === id || id === "master") {
      return data.masterResume;
    }
    return data.tailoredResumes.find((r) => r.id === id) || null;
  },

  saveResume(resume: Resume): void {
    const data = this.loadData();
    const updated = {
      ...resume,
      updatedAt: new Date().toISOString()
    };

    if (resume.type === "master" || resume.id === data.masterResume.id) {
      data.masterResume = updated;
      if (resume.skills && resume.skills.length > 0) {
        defaultMasterResume.skills = JSON.parse(JSON.stringify(resume.skills));
      }
      if (resume.projects && resume.projects.length > 0) {
        defaultMasterResume.projects = JSON.parse(JSON.stringify(resume.projects));
      }
      if (resume.education && resume.education.length > 0) {
        defaultMasterResume.education = JSON.parse(JSON.stringify(resume.education));
      }
    } else {
      const index = data.tailoredResumes.findIndex((r) => r.id === resume.id);
      if (index >= 0) {
        data.tailoredResumes[index] = updated;
      } else {
        data.tailoredResumes.unshift(updated);
      }
    }
    this.saveData(data);
  },

  createTailoredCopy(company: string, jobTitle: string, jobDescription?: string): Resume {
    const data = this.loadData();
    const master = data.masterResume;
    
    // Deep clone the master resume to guarantee independence
    const copy: Resume = JSON.parse(JSON.stringify(master));
    const newId = "tailored-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);
    
    copy.id = newId;
    copy.type = "tailored";
    copy.name = `${company || "Target"} - ${jobTitle || "Resume"}`;
    copy.company = company;
    copy.jobTitle = jobTitle;
    copy.jobDescription = jobDescription || "";
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();

    data.tailoredResumes.unshift(copy);
    data.settings.lastActiveResumeId = newId;
    this.saveData(data);
    return copy;
  },

  duplicateResume(id: string): Resume | null {
    const original = this.getResumeById(id);
    if (!original) return null;

    const data = this.loadData();
    const duplicate: Resume = JSON.parse(JSON.stringify(original));
    duplicate.id = "tailored-" + Date.now().toString(36);
    duplicate.type = "tailored";
    duplicate.name = `${original.name} (Copy)`;
    duplicate.createdAt = new Date().toISOString();
    duplicate.updatedAt = new Date().toISOString();

    data.tailoredResumes.unshift(duplicate);
    this.saveData(data);
    return duplicate;
  },

  deleteResume(id: string): boolean {
    const data = this.loadData();
    if (data.masterResume.id === id) {
      return false; // Master resume cannot be deleted
    }
    const initialLength = data.tailoredResumes.length;
    data.tailoredResumes = data.tailoredResumes.filter((r) => r.id !== id);
    this.saveData(data);
    return data.tailoredResumes.length < initialLength;
  },

  resetToDefaults(): void {
    const initialData: StorageSchema = {
      masterResume: defaultMasterResume,
      tailoredResumes: [],
      settings: {
        lastActiveResumeId: defaultMasterResume.id
      }
    };
    this.saveData(initialData);
  }
};
