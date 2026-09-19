import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { Resume } from "../types/resume";
import { storageService } from "../services/storage/storageService";

interface ResumeContextType {
  masterResume: Resume;
  tailoredResumes: Resume[];
  activeResume: Resume | null;
  saveStatus: "saved" | "saving" | "idle";
  setActiveResumeId: (id: string) => void;
  updateActiveResume: (updated: Partial<Resume>) => void;
  updateMasterContact: (contact: Partial<Resume["contact"]>) => void;
  createTailoredCopy: (company: string, jobTitle: string, jobDescription?: string) => Resume;
  duplicateResume: (id: string) => Resume | null;
  deleteResume: (id: string) => boolean;
  refreshResumes: () => void;
  resetAll: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterResume, setMasterResume] = useState<Resume>(() => storageService.getMasterResume());
  const [tailoredResumes, setTailoredResumes] = useState<Resume[]>(() => storageService.loadData().tailoredResumes);
  const [activeResume, setActiveResume] = useState<Resume | null>(() => storageService.getMasterResume());
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("saved");

  const saveTimerRef = useRef<number | null>(null);

  const refreshResumes = useCallback(() => {
    const data = storageService.loadData();
    setMasterResume(data.masterResume);
    setTailoredResumes(data.tailoredResumes);
  }, []);

  const setActiveResumeId = useCallback(
    (id: string) => {
      const found = storageService.getResumeById(id);
      if (found) {
        setActiveResume(found);
      } else {
        setActiveResume(masterResume);
      }
    },
    [masterResume]
  );

  // Autosave active resume with 400ms debounce
  const updateActiveResume = useCallback((updatedFields: Partial<Resume>) => {
    setActiveResume((prev) => {
      if (!prev) return null;
      const nextResume = { ...prev, ...updatedFields, updatedAt: new Date().toISOString() };
      
      setSaveStatus("saving");
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        storageService.saveResume(nextResume);
        refreshResumes();
        setSaveStatus("saved");
      }, 400);

      return nextResume;
    });
  }, [refreshResumes]);

  const updateMasterContact = useCallback((contactUpdate: Partial<Resume["contact"]>) => {
    setMasterResume((prev) => {
      const updatedContact = { ...prev.contact, ...contactUpdate };
      const nextMaster = {
        ...prev,
        contact: updatedContact,
        updatedAt: new Date().toISOString()
      };
      storageService.saveMasterResume(nextMaster);
      refreshResumes();
      return nextMaster;
    });
  }, [refreshResumes]);

  const handleCreateTailored = useCallback(
    (company: string, jobTitle: string, jobDescription?: string) => {
      const copy = storageService.createTailoredCopy(company, jobTitle, jobDescription);
      refreshResumes();
      setActiveResume(copy);
      return copy;
    },
    [refreshResumes]
  );

  const handleDuplicate = useCallback(
    (id: string) => {
      const duplicate = storageService.duplicateResume(id);
      refreshResumes();
      return duplicate;
    },
    [refreshResumes]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const ok = storageService.deleteResume(id);
      if (ok) {
        refreshResumes();
        if (activeResume?.id === id) {
          setActiveResume(storageService.getMasterResume());
        }
      }
      return ok;
    },
    [activeResume, refreshResumes]
  );

  const handleResetAll = useCallback(() => {
    storageService.resetToDefaults();
    refreshResumes();
    setActiveResume(storageService.getMasterResume());
  }, [refreshResumes]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        masterResume,
        tailoredResumes,
        activeResume,
        saveStatus,
        setActiveResumeId,
        updateActiveResume,
        updateMasterContact,
        createTailoredCopy: handleCreateTailored,
        duplicateResume: handleDuplicate,
        deleteResume: handleDelete,
        refreshResumes,
        resetAll: handleResetAll
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export function useResume(): ResumeContextType {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
