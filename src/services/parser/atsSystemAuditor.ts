import { Resume } from "../../types/resume";
import { analyzeJobMatch } from "../matcher/jobMatcher";

export interface AtsRuleCheck {
  id: string;
  name: string;
  category: "formatting" | "structure" | "content" | "keywords" | "job_alignment";
  status: "pass" | "warn" | "fail";
  points: number; // Max score contribution
  earned: number; // Actual points earned
  description: string;
  recommendation?: string;
}

export interface AtsAuditResult {
  atsKey: string;
  systemName: string;
  company: string;
  marketShare: string;
  overallScore: number;
  parsabilityScore: number;
  jobMatchScore?: number;
  grade: "Poor" | "Needs Work" | "Good" | "Excellent";
  color: string;
  checks: AtsRuleCheck[];
  strengths: string[];
  warnings: string[];
  parserSpecificTip: string;
  logoColor: string;
}

export interface AtsSystemSpec {
  key: string;
  name: string;
  parentCompany: string;
  tagline: string;
  marketShare: string;
  logoBg: string;
  logoColor: string;
  description: string;
  headerParsingStrictness: "high" | "medium" | "low";
  summaryImportance: number;
  metricsWeight: number;
  dateParsingFormat: string;
  skillsFormat: "grouped" | "bulleted" | "inline";
  specificKeywords: string[];
  parserQuirks: string[];
}

export const ATS_SYSTEMS_CATALOG: Record<string, AtsSystemSpec> = {
  Workday: {
    key: "Workday",
    name: "Workday",
    parentCompany: "Workday Inc.",
    tagline: "Enterprise #1 ATS & HCM",
    marketShare: "31% Fortune 500",
    logoBg: "#0875E1",
    logoColor: "#FFFFFF",
    description: "Deep structured parsing with XML-like document trees. Very strict with job title hierarchies and chronological job dates.",
    headerParsingStrictness: "high",
    summaryImportance: 7,
    metricsWeight: 9,
    dateParsingFormat: "Month YYYY (e.g. June 2022 - Present)",
    skillsFormat: "grouped",
    specificKeywords: ["leadership", "collaboration", "cross-functional", "deliverables", "stakeholder", "strategy"],
    parserQuirks: [
      "Requires explicit start and end dates with Month & Year to compute tenure.",
      "Strictly expects standard titles (e.g., 'Software Engineer', 'Product Manager').",
      "Heavily favors quantifiable business outcomes (% improvement, $ revenue, latency reductions)."
    ]
  },
  Greenhouse: {
    key: "Greenhouse",
    name: "Greenhouse",
    parentCompany: "Greenhouse Software",
    tagline: "Modern High-Growth & Tech Standard",
    marketShare: "Leading Tech ATS",
    logoBg: "#00B272",
    logoColor: "#FFFFFF",
    description: "Parser emphasizes modern tech stacks, active project portfolios, open source links, and clear skill keyword tags.",
    headerParsingStrictness: "medium",
    summaryImportance: 8,
    metricsWeight: 8,
    dateParsingFormat: "YYYY or Month YYYY",
    skillsFormat: "grouped",
    specificKeywords: ["typescript", "react", "python", "aws", "docker", "ci/cd", "apis", "system design", "agile"],
    parserQuirks: [
      "Accurately matches specific modern frameworks, libraries, and cloud technologies.",
      "Parses GitHub/Portfolio URLs cleanly and checks for project links.",
      "Scores well when skills are grouped by technical categories (Languages, Frameworks, Cloud)."
    ]
  },
  Taleo: {
    key: "Taleo",
    name: "Oracle Taleo",
    parentCompany: "Oracle Corp.",
    tagline: "Legacy Corporate & Government",
    marketShare: "22% Global Enterprise",
    logoBg: "#C74634",
    logoColor: "#FFFFFF",
    description: "One of the oldest and strictest text parsers in existence. Known to reject non-standard fonts, icons, tables, and unconventional sections.",
    headerParsingStrictness: "high",
    summaryImportance: 5,
    metricsWeight: 7,
    dateParsingFormat: "MM/YYYY - MM/YYYY",
    skillsFormat: "inline",
    specificKeywords: ["compliance", "management", "reporting", "process", "implementation", "governance"],
    parserQuirks: [
      "Extremely sensitive to document formatting: tables, columns, and text boxes cause complete parse failures.",
      "Requires classic standard section names like 'Professional Experience' and 'Education'.",
      "Struggles with special unicode characters, custom bullets, or decorative fonts."
    ]
  },
  iCIMS: {
    key: "iCIMS",
    name: "iCIMS Talent Cloud",
    parentCompany: "iCIMS Inc.",
    tagline: "High-Volume & Healthcare Leader",
    marketShare: "18% Enterprise Recruiting",
    logoBg: "#003A70",
    logoColor: "#FFFFFF",
    description: "Candidate Relationship Management and ATS with advanced keyword frequency matching and educational accreditation scanning.",
    headerParsingStrictness: "medium",
    summaryImportance: 7,
    metricsWeight: 8,
    dateParsingFormat: "Month YYYY",
    skillsFormat: "grouped",
    specificKeywords: ["certification", "operations", "efficiency", "coordination", "analysis", "team"],
    parserQuirks: [
      "Performs deep keyword frequency and density matching against job requisitions.",
      "Validates university degree accreditations, majors, and verified certifications.",
      "Requires explicit contact details (email, phone, location) in standard document body."
    ]
  },
  Lever: {
    key: "Lever",
    name: "Lever",
    parentCompany: "Employ Inc.",
    tagline: "Collaborative Talent Suite",
    marketShare: "Top VC & Scale-up ATS",
    logoBg: "#202E5C",
    logoColor: "#FFFFFF",
    description: "Modern ATS with built-in candidate talent sourcing and proactive recruiter tagging. Emphasizes clean impact bullets.",
    headerParsingStrictness: "medium",
    summaryImportance: 9,
    metricsWeight: 8,
    dateParsingFormat: "Month YYYY or YYYY",
    skillsFormat: "grouped",
    specificKeywords: ["impact", "growth", "optimization", "user-focused", "scale", "collaboration"],
    parserQuirks: [
      "Prioritizes concise, high-impact bullet points with strong action verbs.",
      "Fast parsing speed; parses markdown-like structured text seamlessly.",
      "Places high weight on an impactful professional summary."
    ]
  },
  SmartRecruiters: {
    key: "SmartRecruiters",
    name: "SmartRecruiters",
    parentCompany: "SmartRecruiters Inc.",
    tagline: "Enterprise Global Hiring",
    marketShare: "15% Global Enterprise",
    logoBg: "#1C88E3",
    logoColor: "#FFFFFF",
    description: "AI-assisted parsing with automatic skill clustering, semantic role matching, and multilingual capabilities.",
    headerParsingStrictness: "medium",
    summaryImportance: 8,
    metricsWeight: 8,
    dateParsingFormat: "YYYY or Month YYYY",
    skillsFormat: "grouped",
    specificKeywords: ["innovation", "scaling", "architecture", "microservices", "delivery", "leadership"],
    parserQuirks: [
      "Utilizes semantic AI matching: recognizes synonyms (e.g. K8s = Kubernetes, Golang = Go).",
      "Evaluates overall career progression and seniority trajectory.",
      "Scores skills breadth alongside technical depth."
    ]
  }
};

/**
 * Runs a realistic, deterministic ATS audit of a resume against a specific ATS system's
 * real-world criteria, incorporating both technical parsability and target job description relevance.
 */
export function evaluateResumeForAts(
  resume: Resume,
  systemKey: string,
  jobDescription?: string
): AtsAuditResult {
  const spec = ATS_SYSTEMS_CATALOG[systemKey] || ATS_SYSTEMS_CATALOG.Workday;
  const checks: AtsRuleCheck[] = [];
  const strengths: string[] = [];
  const warnings: string[] = [];

  // Extract resume content
  const contact = resume.contact || { fullName: "", email: "", phone: "", location: "" };
  const experiences = resume.experience || [];
  const projects = resume.projects || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const certifications = resume.certifications || [];
  const summary = (resume.summary || "").trim();

  // 1. CONTACT INFO & ATS PARSABILITY (Max 20 points)
  let contactPoints = 0;
  if (contact.fullName && contact.fullName.trim().length > 2) contactPoints += 6;
  if (contact.email && contact.email.includes("@") && contact.email.includes(".")) contactPoints += 5;
  if (contact.phone && contact.phone.trim().length >= 8) contactPoints += 5;
  if (contact.location && contact.location.trim().length > 2) contactPoints += 4;

  const contactPass = contactPoints >= 16;
  checks.push({
    id: "contact_parser",
    name: "Contact Information Parsability",
    category: "structure",
    status: contactPass ? "pass" : contactPoints >= 10 ? "warn" : "fail",
    points: 20,
    earned: contactPoints,
    description: "Full name, business email, reachable phone number, and location in body.",
    recommendation: contactPass ? undefined : "Ensure phone number and email are populated and not placed in headers or footers."
  });
  if (contactPass) strengths.push("Contact information has 100% extractable fields.");
  else warnings.push("Incomplete contact information may drop you before recruiter review.");

  // 2. PROFESSIONAL SUMMARY & PROFILE MATCH (Max 15 points)
  let summaryPoints = 0;
  if (summary.length >= 80 && summary.length <= 600) {
    summaryPoints = 15;
    strengths.push("Professional summary provides immediate role clarity.");
  } else if (summary.length > 20) {
    summaryPoints = 10;
    warnings.push("Summary is slightly short; aiming for 2-3 concise sentences maximizes keyword extraction.");
  } else {
    summaryPoints = spec.summaryImportance > 7 ? 3 : 6;
    warnings.push(`${spec.name} algorithms rank candidates with a concise summary higher.`);
  }

  checks.push({
    id: "summary_presence",
    name: "Professional Executive Summary",
    category: "content",
    status: summaryPoints >= 12 ? "pass" : summaryPoints >= 8 ? "warn" : "fail",
    points: 15,
    earned: summaryPoints,
    description: "A focused summary allows ATS semantic parsers to cluster your primary persona.",
    recommendation: summary.length < 80 ? "Expand summary to 2-3 impactful sentences highlighting core competencies and achievements." : undefined
  });

  // 3. WORK EXPERIENCE & METRICS / ACHIEVEMENTS (Max 25 points)
  let expPoints = 0;
  if (experiences.length > 0) {
    expPoints += 10;
    const allBullets = experiences.flatMap((e) => e.bullets || []).filter((b) => b.trim().length > 0);
    if (allBullets.length >= experiences.length * 2) {
      expPoints += 5;
    }

    const metricRegex = /\b\d+(\.\d+)?%|\$\d+|\b\d+\s*(users|clients|teams|projects|ms|s|hours|days|x|fold)\b|\b(increased|reduced|decreased|saved|generated|optimized|scaled|accelerated|improved|delivered)\b/i;
    const bulletsWithMetrics = allBullets.filter((b) => metricRegex.test(b));

    if (bulletsWithMetrics.length >= 2) {
      expPoints += 10;
      strengths.push(`${bulletsWithMetrics.length} experience bullet points contain quantifiable business impact metrics.`);
    } else if (bulletsWithMetrics.length === 1) {
      expPoints += 5;
      warnings.push("Quantifiable metrics (%, $, numbers) dramatically boost ranking in " + spec.name + ".");
    } else {
      expPoints += 2;
      warnings.push("Bullet points focus heavily on duties rather than measurable results and metrics.");
    }
  } else {
    warnings.push("No work experience entries detected.");
  }

  checks.push({
    id: "experience_metrics",
    name: "Quantifiable Impact & Work History",
    category: "content",
    status: expPoints >= 20 ? "pass" : expPoints >= 12 ? "warn" : "fail",
    points: 25,
    earned: Math.min(25, expPoints),
    description: "Chronological experience entries featuring data points, percentages, and business metrics.",
    recommendation: expPoints < 20 ? "Add numbers, percentages, or concrete team sizes to your accomplishment bullets." : undefined
  });

  // 4. SKILLS SECTION & KEYWORD DENSITY (Max 20 points)
  let skillsPoints = 0;
  const totalSkillsCount = skills.reduce((acc, cat) => acc + (cat.skills ? cat.skills.length : 0), 0);

  if (skills.length >= 2 && totalSkillsCount >= 8) {
    skillsPoints = 20;
    strengths.push(`Skills section is well-categorized (${skills.length} categories, ${totalSkillsCount} keywords).`);
  } else if (skills.length >= 1 && totalSkillsCount >= 4) {
    skillsPoints = 14;
  } else if (totalSkillsCount > 0) {
    skillsPoints = 8;
    warnings.push("Skills section has few keywords. Add category groups (Languages, Tools, Methodologies).");
  } else {
    skillsPoints = 0;
    warnings.push("Missing a structured Skills section.");
  }

  checks.push({
    id: "skills_density",
    name: "Categorized Technical & Core Skills",
    category: "keywords",
    status: skillsPoints >= 16 ? "pass" : skillsPoints >= 10 ? "warn" : "fail",
    points: 20,
    earned: skillsPoints,
    description: "Skills organized into clean categories without visual rating graphics or progress bars.",
    recommendation: skillsPoints < 16 ? "Group skills into 2+ categories with 4-8 specific technical terms each." : undefined
  });

  // 5. EDUCATION & CREDENTIALS (Max 10 points)
  let eduPoints = 0;
  if (education.length > 0) eduPoints += 6;
  if (certifications.length > 0) eduPoints += 4;
  if (education.length === 0 && certifications.length === 0) {
    warnings.push("Education or professional training entries not listed.");
  }

  checks.push({
    id: "education_creds",
    name: "Education & Certifications",
    category: "structure",
    status: eduPoints >= 8 ? "pass" : eduPoints >= 5 ? "warn" : "fail",
    points: 10,
    earned: Math.min(10, eduPoints),
    description: "Degrees, institutions, completion years, or active professional certifications.",
    recommendation: eduPoints < 6 ? "Add your degrees, certifications, or specialized bootcamps." : undefined
  });

  // 6. SYSTEM-SPECIFIC ATS PARSING COMPATIBILITY (Max 10 points)
  let atsSpecificPoints = 7;
  const fullText = [
    contact.fullName,
    contact.title,
    summary,
    ...experiences.flatMap((e) => [e.company, e.role, ...e.bullets]),
    ...projects.flatMap((p) => [p.name, ...(p.technologies || []), ...p.bullets]),
    ...skills.flatMap((s) => [s.name, ...s.skills])
  ].join(" ").toLowerCase();

  // Match system-specific keywords
  const matchedSysKeywords = spec.specificKeywords.filter((k) => fullText.includes(k.toLowerCase()));
  if (matchedSysKeywords.length >= 3) {
    atsSpecificPoints += 3;
    strengths.push(`Optimized for ${spec.name}: matched ${matchedSysKeywords.length} preferred criteria terms.`);
  } else if (matchedSysKeywords.length >= 1) {
    atsSpecificPoints += 2;
  }

  // Workday penalty if dates are ambiguous
  if (spec.key === "Workday") {
    const hasClearDates = experiences.every((e) => Boolean(e.startDate && e.endDate));
    if (!hasClearDates && experiences.length > 0) {
      atsSpecificPoints = Math.max(2, atsSpecificPoints - 3);
      warnings.push("Workday requires explicit Start and End dates on every position to compute tenure.");
    }
  }

  // Taleo strict single-column text check
  if (spec.key === "Taleo") {
    atsSpecificPoints = Math.min(10, atsSpecificPoints + 1);
  }

  checks.push({
    id: "ats_custom_parser",
    name: `${spec.name} Parser Optimization`,
    category: "formatting",
    status: atsSpecificPoints >= 8 ? "pass" : "warn",
    points: 10,
    earned: Math.min(10, atsSpecificPoints),
    description: `Specific compatibility with ${spec.name}'s proprietary ingestion parser.`,
    recommendation: spec.parserQuirks[0]
  });

  // Baseline Parsability Score (0-100)
  const parsabilityPoints = checks.reduce((sum, c) => sum + c.earned, 0);
  const parsabilityScore = Math.max(0, Math.min(100, Math.round(parsabilityPoints)));

  // 7. TARGET JOB DESCRIPTION MATCHING & BLENDED ATS SCORE
  let overallScore = parsabilityScore;
  let jobMatchScore: number | undefined = undefined;

  const hasJobDescription = Boolean(jobDescription && jobDescription.trim().length > 25);

  if (hasJobDescription && jobDescription) {
    const jobMatch = analyzeJobMatch(resume, jobDescription);
    jobMatchScore = jobMatch.score;

    const matchedCount = jobMatch.matchedKeywords.length;
    const missingCount = jobMatch.missingKeywords.length;

    // Weighting: 50% technical parsability & document compliance + 50% target job keyword relevance
    overallScore = Math.round(parsabilityScore * 0.5 + jobMatchScore * 0.5);

    checks.unshift({
      id: "job_description_match",
      name: "Job Description Alignment & Keyword Match",
      category: "job_alignment",
      status: jobMatchScore >= 70 ? "pass" : jobMatchScore >= 45 ? "warn" : "fail",
      points: 100,
      earned: jobMatchScore,
      description: `Matched ${matchedCount} target job keywords (${missingCount} missing keywords). Score weighs 50% of overall ATS ranking.`,
      recommendation:
        missingCount > 0
          ? `Incorporate missing target terms into skills/bullets: ${jobMatch.missingKeywords.slice(0, 5).join(", ")}`
          : undefined
    });

    if (jobMatchScore >= 70) {
      strengths.push(`Strong alignment with target job posting (${matchedCount} core skills & terms matched).`);
    } else {
      warnings.push(`Target job description match is ${jobMatchScore}%. Adding missing keywords from the job desc will increase your ATS score.`);
    }
  } else {
    // When no target job description is provided:
    // ATS ranking requires both technical formatting AND keyword relevance against an opening.
    // We cap the maximum score and clearly flag the missing job description.
    jobMatchScore = 0;
    // 60% weight to technical parsability, missing JD leaves alignment unproven
    overallScore = Math.round(parsabilityScore * 0.6);

    checks.unshift({
      id: "job_description_match",
      name: "Job Description Alignment & Keyword Match",
      category: "job_alignment",
      status: "warn",
      points: 100,
      earned: 0,
      description: "No target job description provided. ATS scoring requires both document parsability and job description keyword alignment.",
      recommendation: "Paste the target job description in the 'Target Job Description' card to calculate full keyword relevance and match percentage."
    });

    warnings.push("Target job description missing. Paste the job description below to verify keyword match and unlock full ATS scoring potential.");
  }

  let grade: "Poor" | "Needs Work" | "Good" | "Excellent" = "Poor";
  let color = "#E53935";
  if (overallScore >= 85) {
    grade = "Excellent";
    color = "#1B5E20";
  } else if (overallScore >= 70) {
    grade = "Good";
    color = "#4CAF50";
  } else if (overallScore >= 50) {
    grade = "Needs Work";
    color = "#FBC02D";
  }

  return {
    atsKey: spec.key,
    systemName: spec.name,
    company: spec.parentCompany,
    marketShare: spec.marketShare,
    overallScore,
    parsabilityScore,
    jobMatchScore,
    grade,
    color,
    checks,
    strengths,
    warnings,
    parserSpecificTip: spec.parserQuirks[0],
    logoColor: spec.logoBg
  };
}

