export type JobMatch = {
  resumeId: string;
  jobDescription: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  relatedKeywords: string[];
  analyzedAt: string;
  score: number; // 0-100%
  breakdown: {
    technical: { matched: string[]; missing: string[] };
    tools: { matched: string[]; missing: string[] };
    methodologies: { matched: string[]; missing: string[] };
    softSkills: { matched: string[]; missing: string[] };
  };
};

export type KeywordCategory = "technical" | "tools" | "methodologies" | "softSkills" | "other";
