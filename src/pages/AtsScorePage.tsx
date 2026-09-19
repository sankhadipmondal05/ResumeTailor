import React, { useState, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Grid,
  Stack,
  Alert
} from "@mui/material";
import { useResume } from "../context/ResumeContext";
import { ATS_SYSTEMS_CATALOG, evaluateResumeForAts, AtsAuditResult } from "../services/parser/atsSystemAuditor";
import { AtsScoreDialCard } from "../components/resume/AtsScoreDialCard";
import { AtsAnalysisLoadingCard } from "../components/resume/AtsAnalysisLoadingCard";
import { Resume } from "../types/resume";

export const AtsScorePage: React.FC = () => {
  const { masterResume } = useResume();

  const [selectedAts, setSelectedAts] = useState<string>("Workday");
  const [jobDescription, setJobDescription] = useState<string>("");

  // Resume source state: can be an existing resume or an uploaded/dropped file
  const [activeResumeSource, setActiveResumeSource] = useState<Resume>(masterResume);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis process state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasCompletedAnalysis, setHasCompletedAnalysis] = useState<boolean>(false);

  // Compute live audit result
  const atsAudit: AtsAuditResult = useMemo(() => {
    return evaluateResumeForAts(activeResumeSource, selectedAts, jobDescription);
  }, [activeResumeSource, selectedAts, jobDescription]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processUploadedFile = (file: File) => {
    setUploadedFileName(file.name);
    // Parse text from file if text/json, or treat as uploaded candidate resume
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const parsedJson = JSON.parse(text);
        if (parsedJson.contact || parsedJson.experience) {
          setActiveResumeSource({
            ...masterResume,
            ...parsedJson,
            name: file.name
          });
          return;
        }
      } catch {
        // Plain text file - extract text into summary/bullets
      }

      // If text/doc extract lines
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      setActiveResumeSource({
        ...masterResume,
        name: file.name,
        summary: lines.slice(0, 4).join(" ") || masterResume.summary
      });
    };

    if (file.name.endsWith(".json") || file.name.endsWith(".txt")) {
      reader.readAsText(file);
    } else {
      // PDF or DOCX file dropped: we acknowledge file and analyze with current profile
      reader.readAsText(file.slice(0, 5000));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleStartCheck = () => {
    setIsAnalyzing(true);
    setHasCompletedAnalysis(false);
  };

  const handleLoadingComplete = () => {
    setIsAnalyzing(false);
    setHasCompletedAnalysis(true);
  };

  const currentSpec = ATS_SYSTEMS_CATALOG[selectedAts] || ATS_SYSTEMS_CATALOG.Workday;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1440, mx: "auto", minHeight: "calc(100vh - 65px)" }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ fontSize: "1.85rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>
          ATS Resume Scanner & Score
        </Typography>
        <Typography variant="body1" sx={{ color: "#64748B", mt: 0.5, fontSize: "0.95rem" }}>
          Test your resume's technical parsability and job description alignment across major ATS systems.
        </Typography>
      </Box>

      {/* Main Grid: Left Column (Controls & Inputs) | Right Column (Loading screens or Detailed Audit Breakdown) */}
      <Grid container spacing={4} alignItems="flex-start">
        {/* LEFT COLUMN: Score Dial -> System Dropdown -> Drag & Drop Resume -> Job Desc -> Check Button */}
        <Grid item xs={12} md={5} lg={4.5}>
          <Stack spacing={2.5}>
            {/* 1. Score Dial Card with integrated side-by-side buttons: [Select ATS System] [Check] */}
            <AtsScoreDialCard
              score={hasCompletedAnalysis || !isAnalyzing ? atsAudit.overallScore : 0}
              isLoading={isAnalyzing}
              selectedAts={selectedAts}
              onSelectAts={(ats) => setSelectedAts(ats)}
              onCheck={handleStartCheck}
            />

            {/* 2. Drag and Drop Area to Drop Resume */}
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                bgcolor: isDragging ? "#EEF2FF" : "#FFFFFF",
                border: isDragging ? "2px dashed #6366F1" : "2px dashed #CBD5E1",
                borderRadius: "20px",
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#F8FAFC",
                  borderColor: "#94A3B8"
                }
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".pdf,.docx,.txt,.json"
                onChange={handleFileInputChange}
              />
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  bgcolor: "#F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1.5,
                  color: "#6366F1"
                }}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </Box>

              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#1E293B" }}>
                {uploadedFileName ? uploadedFileName : "Drop your resume here"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 0.5 }}>
                {uploadedFileName
                  ? "Click or drop another file to replace (PDF, DOCX, TXT, JSON)"
                  : "or browse file from your device (PDF, DOCX, TXT, JSON)"}
              </Typography>
            </Box>

            {/* 4. Job Description Input Area */}
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                borderRadius: "20px",
                p: 2.5,
                border: "1px solid #EEF2F6",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#334155" }}>
                  Target Job Description
                </Typography>
                <Chip
                  label="50% Score Weight"
                  size="small"
                  sx={{ height: 20, fontSize: "0.68rem", fontWeight: 700, bgcolor: "#FEF3C7", color: "#B45309" }}
                />
              </Box>
              <TextField
                placeholder="Paste the target job description here to check keyword alignment & role requirements..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                multiline
                minRows={4}
                maxRows={8}
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F8FAFC",
                    fontSize: "0.85rem",
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Stack>
        </Grid>

        {/* RIGHT COLUMN: When checking -> loading screens; else -> breakdown & recommendations */}
        <Grid item xs={12} md={7} lg={7.5}>
          {isAnalyzing ? (
            <AtsAnalysisLoadingCard onComplete={handleLoadingComplete} />
          ) : (
            <Box
              sx={{
                bgcolor: "#FFFFFF",
                borderRadius: "28px",
                p: { xs: 3, md: 4 },
                border: "1px solid #EEF2F6",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)"
              }}
            >
              {/* Header result */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.01em" }}>
                    {currentSpec.name} Audit Results
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B", mt: 0.25 }}>
                    Evaluated candidate: {activeResumeSource.contact.fullName || "Candidate"} • {activeResumeSource.contact.title || "Professional"}
                  </Typography>
                </Box>
                <Chip
                  label={`${atsAudit.overallScore}/100 • ${atsAudit.grade}`}
                  sx={{
                    bgcolor: atsAudit.color,
                    color: "#FFFFFF",
                    fontWeight: 700,
                    px: 1,
                    fontSize: "0.85rem"
                  }}
                />
              </Box>

              {/* Status Summary Banner */}
              {jobDescription.trim().length === 0 ? (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                  <strong>Target job description is missing.</strong> Paste the job description on the left to verify your keyword match percentage (50% of total score).
                </Alert>
              ) : atsAudit.overallScore >= 80 ? (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  <strong>Ready for submission!</strong> This resume demonstrates high technical parsability and strong keyword alignment with {currentSpec.name}.
                </Alert>
              ) : (
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  <strong>Optimization recommended.</strong> Review the pass/warn checklist below to improve keyword coverage and structural compliance.
                </Alert>
              )}

              {/* Dual breakdown banner */}
              <Grid container spacing={2} sx={{ mb: 3.5 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: "18px", border: "1px solid #E2E8F0" }}>
                    <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
                      1. Technical Parsability
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#0F172A", my: 0.5 }}>
                      {atsAudit.parsabilityScore}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748B" }}>
                      Document format, single-column layout, contact info & metrics.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: (atsAudit.jobMatchScore ?? 0) > 0 ? "#F0FDF4" : "#FFFBEB",
                      borderRadius: "18px",
                      border: `1px solid ${(atsAudit.jobMatchScore ?? 0) > 0 ? "#BBF7D0" : "#FDE68A"}`
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: (atsAudit.jobMatchScore ?? 0) > 0 ? "#166534" : "#92400E",
                        fontWeight: 700,
                        textTransform: "uppercase"
                      }}
                    >
                      2. Job Description Match
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: (atsAudit.jobMatchScore ?? 0) > 0 ? "#15803D" : "#B45309",
                        my: 0.5
                      }}
                    >
                      {atsAudit.jobMatchScore !== undefined ? `${atsAudit.jobMatchScore}%` : "0%"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: (atsAudit.jobMatchScore ?? 0) > 0 ? "#166534" : "#92400E" }}
                    >
                      Matched skills & keywords from target job posting.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Criteria Checklist */}
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0F172A", mb: 1.5 }}>
                Parser Compliance Checks:
              </Typography>
              <Stack spacing={1.5}>
                {atsAudit.checks.map((chk) => (
                  <Box
                    key={chk.id}
                    sx={{
                      p: 2,
                      borderRadius: "16px",
                      bgcolor: chk.status === "pass" ? "#F9FBF9" : chk.status === "warn" ? "#FFFDF5" : "#FEF7F7",
                      border: `1px solid ${
                        chk.status === "pass" ? "#DCEFDD" : chk.status === "warn" ? "#FEF08A" : "#FEE2E2"
                      }`
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: chk.status === "pass" ? "#DCFCE7" : "#FEF3C7",
                            color: chk.status === "pass" ? "#16A34A" : "#D97706",
                            fontSize: "0.75rem",
                            fontWeight: 700
                          }}
                        >
                          {chk.status === "pass" ? "✓" : "!"}
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: "#0F172A" }}>
                          {chk.name}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: chk.status === "pass" ? "#16A34A" : "#D97706"
                        }}
                      >
                        +{chk.earned} / {chk.points} pts
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: "#64748B", mt: 0.75, pl: 4, fontSize: "0.84rem" }}>
                      {chk.description}
                    </Typography>
                    {chk.recommendation && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#B45309", fontWeight: 600, display: "block", mt: 0.5, pl: 4 }}
                      >
                        Recommendation: {chk.recommendation}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
