import { Resume } from "../../types/resume";
import { JobMatch } from "../../types/matching";
import { DOMAIN_DICTIONARY } from "../parser/dictionary";
import { extractTokensAndPhrases, normalizeToken } from "../parser/textTokenizer";

export function analyzeJobMatch(resume: Resume, jobDescription: string): JobMatch {
  if (!jobDescription.trim()) {
    return {
      resumeId: resume.id,
      jobDescription: "",
      matchedKeywords: [],
      missingKeywords: [],
      relatedKeywords: [],
      analyzedAt: new Date().toISOString(),
      score: 0,
      breakdown: {
        technical: { matched: [], missing: [] },
        tools: { matched: [], missing: [] },
        methodologies: { matched: [], missing: [] },
        softSkills: { matched: [], missing: [] }
      }
    };
  }

  // 1. Flatten all resume content to text tokens
  const resumeTextParts: string[] = [
    resume.contact.title || "",
    resume.summary || "",
    ...resume.experience.flatMap((e) => [e.company, e.role, ...e.bullets]),
    ...resume.projects.flatMap((p) => [p.name, ...(p.technologies || []), ...p.bullets]),
    ...resume.education.flatMap((ed) => [ed.institution, ed.degree, ed.field || "", ed.details || ""]),
    ...resume.skills.flatMap((s) => [s.name, ...s.skills]),
    ...resume.certifications.flatMap((c) => [c.name, c.issuer])
  ];
  const resumeText = resumeTextParts.join(" ");
  const resumeTokens = new Set(extractTokensAndPhrases(resumeText));

  // 2. Extract keywords from job description
  const jdTokens = new Set(extractTokensAndPhrases(jobDescription));

  // 3. Match against dictionary categories
  const categories: Array<keyof typeof DOMAIN_DICTIONARY> = ["technical", "tools", "methodologies", "softSkills"];

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const breakdown = {
    technical: { matched: [] as string[], missing: [] as string[] },
    tools: { matched: [] as string[], missing: [] as string[] },
    methodologies: { matched: [] as string[], missing: [] as string[] },
    softSkills: { matched: [] as string[], missing: [] as string[] }
  };

  categories.forEach((cat) => {
    const termList = DOMAIN_DICTIONARY[cat];
    termList.forEach((term) => {
      const normalizedTerm = normalizeToken(term);
      const isPresentInJD = jdTokens.has(normalizedTerm) || jobDescription.toLowerCase().includes(term);
      if (isPresentInJD) {
        const isPresentInResume = resumeTokens.has(normalizedTerm) || resumeText.toLowerCase().includes(term);
        if (isPresentInResume) {
          matchedKeywords.push(term);
          breakdown[cat].matched.push(term);
        } else {
          missingKeywords.push(term);
          breakdown[cat].missing.push(term);
        }
      }
    });
  });

  // Calculate score based on found JD keywords
  const totalKeywordsFoundInJD = matchedKeywords.length + missingKeywords.length;
  const score = totalKeywordsFoundInJD > 0 ? Math.round((matchedKeywords.length / totalKeywordsFoundInJD) * 100) : 0;

  // Find related keywords (terms in resume that might complement the missing terms)
  const relatedKeywords: string[] = [];
  categories.forEach((cat) => {
    DOMAIN_DICTIONARY[cat].forEach((term) => {
      if (resumeTokens.has(normalizeToken(term)) && !matchedKeywords.includes(term) && !missingKeywords.includes(term)) {
        relatedKeywords.push(term);
      }
    });
  });

  return {
    resumeId: resume.id,
    jobDescription,
    matchedKeywords: Array.from(new Set(matchedKeywords)),
    missingKeywords: Array.from(new Set(missingKeywords)),
    relatedKeywords: Array.from(new Set(relatedKeywords)).slice(0, 8),
    analyzedAt: new Date().toISOString(),
    score,
    breakdown
  };
}
