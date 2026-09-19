import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  TextField,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  DownloadIcon,
  ArrowBackIcon,
  CheckCircleOutlineIcon,
  WarningAmberIcon
} from "../components/icons/Icons";

import { useResume } from "../context/ResumeContext";
import { ContactEditor } from "../components/editor/ContactEditor";
import { SummaryEditor } from "../components/editor/SummaryEditor";
import { ExperienceEditor } from "../components/editor/ExperienceEditor";
import { ProjectsEditor } from "../components/editor/ProjectsEditor";
import { EducationEditor } from "../components/editor/EducationEditor";
import { SkillsEditor } from "../components/editor/SkillsEditor";
import { CertificationsEditor } from "../components/editor/CertificationsEditor";
import { ResumeSettingsEditor } from "../components/editor/ResumeSettingsEditor";
import { AtsResumeRenderer } from "../components/resume/AtsResumeRenderer";
import { AtsSpeedometer } from "../components/resume/AtsSpeedometer";
import { exportResumeToPdf, exportResumeToBlob, generatePdfFilename } from "../services/pdf/pdfExport";
import {
  ATS_SYSTEMS_CATALOG,
  evaluateResumeForAts,
  AtsAuditResult
} from "../services/parser/atsSystemAuditor";

export const ResumeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { masterResume, tailoredResumes, activeResume, setActiveResumeId, updateActiveResume } = useResume();

  const [isExporting, setIsExporting] = useState(false);
  const [selectedAts, setSelectedAts] = useState<string>("Workday");
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  const targetResume = useMemo(() => {
    if (!id || id === "master") {
      return masterResume;
    }
    return tailoredResumes.find((r) => r.id === id) || masterResume;
  }, [id, masterResume, tailoredResumes]);

  useEffect(() => {
    if (id) {
      setActiveResumeId(id);
    } else {
      setActiveResumeId(masterResume.id);
    }
  }, [id, masterResume.id, setActiveResumeId]);

  const currentResume = activeResume || targetResume;

  // Compute real ATS audit based on actual parser rules
  const atsAudit: AtsAuditResult = useMemo(() => {
    if (!currentResume) {
      return evaluateResumeForAts(masterResume, selectedAts);
    }
    return evaluateResumeForAts(currentResume, selectedAts, currentResume.jobDescription);
  }, [currentResume, masterResume, selectedAts]);

  const atsScore = atsAudit.overallScore;

  const [chatGptSnackbarOpen, setChatGptSnackbarOpen] = useState(false);
  const [chatGptSnackbarMsg, setChatGptSnackbarMsg] = useState("");

  if (!currentResume) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleOpenRealChatGPT = async () => {
    const filename = generatePdfFilename(currentResume);

    // 1. Generate the actual CV's PDF file from the ATS resume document
    let pdfBlob: Blob | null = null;
    try {
      pdfBlob = await exportResumeToBlob("ats-resume-document");
    } catch (e) {
      console.error("Failed to generate PDF blob:", e);
    }

    // 2. Trigger instant download of the PDF file so user has the actual CV PDF right in Chrome's download bar
    if (pdfBlob) {
      const fileUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(fileUrl), 5000);

      // Also copy PDF file object to clipboard if ClipboardItem supports it
      try {
        if (typeof ClipboardItem !== "undefined" && navigator.clipboard && navigator.clipboard.write) {
          const item = new ClipboardItem({ "application/pdf": pdfBlob });
          await navigator.clipboard.write([item]);
        }
      } catch {
        // Fallback to copying the prompt text if binary clipboard write is restricted
        const promptText = `tailor this cv according to this job desc\n\nTARGET JOB DESCRIPTION:\n"""\n${currentResume.jobDescription?.trim() || "(Optimize for industry best practices)"}\n"""`;
        navigator.clipboard.writeText(promptText);
      }
    } else {
      // Fallback text copy if blob generation failed
      const promptText = `tailor this cv according to this job desc\n\nTARGET JOB DESCRIPTION:\n"""\n${currentResume.jobDescription?.trim() || "(Optimize for industry best practices)"}\n"""`;
      navigator.clipboard.writeText(promptText);
    }

    // 3. Open real ChatGPT in Chrome with the initial prompt "tailor this cv according to this job desc"
    const chatGptPrompt = `tailor this cv according to this job desc:\n\nTARGET JOB DESCRIPTION:\n${currentResume.jobDescription?.trim() || "See attached CV"}`;
    const chatGptUrl = `https://chatgpt.com/?hints=search&q=${encodeURIComponent(chatGptPrompt.slice(0, 1500))}`;

    window.open(chatGptUrl, "_blank", "noopener,noreferrer");

    // 4. Show clear user feedback
    setChatGptSnackbarMsg(
      `CV PDF "${filename}" downloaded! Drag or attach it into the opened ChatGPT tab.`
    );
    setChatGptSnackbarOpen(true);
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const filename = generatePdfFilename(currentResume);
      await exportResumeToPdf("ats-resume-document", filename);
    } finally {
      setIsExporting(false);
    }
  };

  const currentSpec = ATS_SYSTEMS_CATALOG[selectedAts] || ATS_SYSTEMS_CATALOG.Workday;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)" }}>
      {/* Sub-header Bar */}
      <Box
        sx={{
          px: 3,
          py: 1,
          borderBottom: "1px solid #E4E6E8",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#FFFFFF",
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Tooltip title="Back to Resumes" arrow>
            <IconButton
              size="small"
              onClick={() => navigate("/resumes")}
              sx={{
                color: "#111111",
                border: "1px solid #E4E6E8",
                borderRadius: 2,
                p: "6px",
                "&:hover": { bgcolor: "#F7F7F8" }
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          {currentResume.type === "tailored" && currentResume.company && (
            <Typography variant="h6" sx={{ fontSize: "1.05rem", fontWeight: 700 }}>
              {currentResume.company} {currentResume.jobTitle ? `— ${currentResume.jobTitle}` : ""}
            </Typography>
          )}
        </Box>

        {/* Right Toolbar: ATS System Selector -> ATS Score Speedometer -> Download PDF */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* 1. Real ATS System Selector */}
          <FormControl size="small">
            <Select
              value={selectedAts}
              onChange={(e) => setSelectedAts(e.target.value)}
              displayEmpty
              renderValue={(selected) => {
                const spec = ATS_SYSTEMS_CATALOG[selected] || currentSpec;
                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: spec.logoBg
                      }}
                    />
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#111111", lineHeight: 1 }}>
                      {spec.name}
                    </Typography>
                  </Box>
                );
              }}
              sx={{
                fontSize: "0.85rem",
                borderRadius: 2,
                bgcolor: "#FFFFFF",
                height: 36,
                minWidth: 165,
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  height: "36px !important",
                  boxSizing: "border-box",
                  py: 0,
                  pl: 1.75,
                  pr: "36px !important",
                  fontWeight: 600
                },
                "& .MuiSelect-icon": {
                  top: "calc(50% - 12px)"
                }
              }}
            >
              {Object.values(ATS_SYSTEMS_CATALOG).map((ats) => (
                <MenuItem key={ats.key} value={ats.key} sx={{ py: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 0.25 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: ats.logoBg
                          }}
                        />
                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#111" }}>
                          {ats.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={ats.marketShare}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          bgcolor: "#F0F2F5",
                          color: "#5F6368"
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#70757A", fontSize: "0.72rem", pl: 2 }}>
                      {ats.tagline}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 2. ATS Score Dial (0-100 Speedometer Gauge) with clickable deep audit tooltip */}
          <Tooltip title={`Click to view detailed ${currentSpec.name} parsing breakdown`} arrow>
            <Box
              onClick={() => setAuditModalOpen(true)}
              sx={{
                cursor: "pointer",
                p: "2px 6px",
                borderRadius: 2,
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.04)"
                }
              }}
            >
              <AtsSpeedometer
                score={atsScore}
                parsabilityScore={atsAudit.parsabilityScore}
                jobMatchScore={atsAudit.jobMatchScore}
                resetTrigger={selectedAts}
                size={56}
              />
            </Box>
          </Tooltip>

          {/* 3. Download PDF Button */}
          <Button
            size="small"
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={isExporting}
            onClick={handleExportPdf}
            sx={{ borderRadius: 2, height: 36, px: 2, fontWeight: 600 }}
          >
            {isExporting ? "Generating..." : "Download PDF"}
          </Button>

          {/* 4. Native Vector Print Option */}
          <Tooltip title="Print directly or save as vector PDF with 100% crisp native text (Ctrl+P)" arrow>
            <Button
              size="small"
              variant="outlined"
              onClick={() => window.print()}
              sx={{ borderRadius: 2, height: 36, px: 1.5, fontWeight: 600, color: "#4B5563", borderColor: "#D1D5DB" }}
            >
              Print / Vector PDF
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {/* Real ATS Ingestion Audit Dialog */}
      <Dialog
        open={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ pb: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: currentSpec.logoBg
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {currentSpec.name} Parser Audit
              </Typography>
              <Chip
                label={`${atsScore}/100 • ${atsAudit.grade}`}
                size="small"
                sx={{
                  fontWeight: 700,
                  bgcolor: atsAudit.color,
                  color: "#FFFFFF",
                  height: 22,
                  fontSize: "0.72rem"
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "#5F6368", display: "block", mt: 0.5 }}>
              {currentSpec.parentCompany} • {currentSpec.tagline} ({currentSpec.marketShare})
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setAuditModalOpen(false)}>
            ✕
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          {/* Parser Description Banner */}
          <Box
            sx={{
              p: 1.5,
              mb: 2.5,
              bgcolor: "#F8F9FA",
              borderRadius: 2,
              border: "1px solid #E4E6E8",
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start"
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: currentSpec.logoBg,
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.75rem",
                flexShrink: 0,
                mt: "2px"
              }}
            >
              i
            </Box>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#202124" }}>
                How {currentSpec.name} Ingests Your Resume:
              </Typography>
              <Typography variant="caption" sx={{ color: "#5F6368", display: "block", mt: 0.25 }}>
                {currentSpec.description}
              </Typography>
            </Box>
          </Box>

          {/* Dual Score Overview: Parsability (50%) + Job Alignment (50%) */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mb: 2.5
            }}
          >
            <Box sx={{ p: 1.5, bgcolor: "#F8F9FA", borderRadius: 2, border: "1px solid #E4E6E8" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: "#5F6368", fontWeight: 700, textTransform: "uppercase", fontSize: "0.68rem" }}>
                  1. Parsability (50% Weight)
                </Typography>
                <Chip
                  label="Formatting & Parser"
                  size="small"
                  sx={{ height: 18, fontSize: "0.62rem", fontWeight: 600, bgcolor: "#E5E7EB" }}
                />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827", mt: 0.5 }}>
                {atsAudit.parsabilityScore}%
              </Typography>
              <Typography variant="caption" sx={{ color: "#70757A", display: "block", mt: 0.25 }}>
                Single-column layout, contact info, standard headings & metrics.
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.5,
                bgcolor: (atsAudit.jobMatchScore ?? 0) > 0 ? "#F0FDF4" : "#FFFBEB",
                borderRadius: 2,
                border: `1px solid ${(atsAudit.jobMatchScore ?? 0) > 0 ? "#BBF7D0" : "#FDE68A"}`
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: (atsAudit.jobMatchScore ?? 0) > 0 ? "#166534" : "#92400E",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    fontSize: "0.68rem"
                  }}
                >
                  2. Job Match (50% Weight)
                </Typography>
                <Chip
                  label={(atsAudit.jobMatchScore ?? 0) > 0 ? "Keywords Matched" : "JD Needed"}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    bgcolor: (atsAudit.jobMatchScore ?? 0) > 0 ? "#DCFCE7" : "#FEF3C7",
                    color: (atsAudit.jobMatchScore ?? 0) > 0 ? "#15803D" : "#B45309"
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: (atsAudit.jobMatchScore ?? 0) > 0 ? "#15803D" : "#B45309",
                  mt: 0.5
                }}
              >
                {atsAudit.jobMatchScore !== undefined ? `${atsAudit.jobMatchScore}%` : "0%"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: (atsAudit.jobMatchScore ?? 0) > 0 ? "#166534" : "#92400E",
                  display: "block",
                  mt: 0.25
                }}
              >
                {(atsAudit.jobMatchScore ?? 0) > 0
                  ? "Keywords, skills & requirements matched against target job description."
                  : "Paste job description below to test keyword alignment and raise overall score."}
              </Typography>
            </Box>
          </Box>

          {/* Checklist of Real Audit Criteria */}
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: "#111111" }}>
            Scoring Criteria Breakdown:
          </Typography>

          <List dense disablePadding>
            {atsAudit.checks.map((chk) => (
              <ListItem
                key={chk.id}
                disableGutters
                sx={{
                  py: 1,
                  px: 1.25,
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: chk.status === "pass" ? "#F9FBF9" : chk.status === "warn" ? "#FFFDF5" : "#FEF7F7",
                  border: `1px solid ${
                    chk.status === "pass" ? "#DCEFDD" : chk.status === "warn" ? "#FEF08A" : "#FEE2E2"
                  }`
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {chk.status === "pass" ? (
                    <CheckCircleOutlineIcon sx={{ color: "#16803C", fontSize: 20 }} />
                  ) : (
                    <WarningAmberIcon sx={{ color: chk.status === "warn" ? "#A16207" : "#DC2626", fontSize: 20 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#111111" }}>
                        {chk.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: chk.status === "pass" ? "#16803C" : "#A16207"
                        }}
                      >
                        +{chk.earned} / {chk.points} pts
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.25 }}>
                      <Typography variant="caption" sx={{ color: "#5F6368", display: "block" }}>
                        {chk.description}
                      </Typography>
                      {chk.recommendation && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#A16207",
                            fontWeight: 600,
                            display: "block",
                            mt: 0.25
                          }}
                        >
                          Tip: {chk.recommendation}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          {/* Parser Quirks */}
          <Box sx={{ mt: 2.5, p: 1.5, bgcolor: "#F0F4F8", borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#1A365D", display: "block", mb: 0.5 }}>
              Key {currentSpec.name} Parser Rules to Pass:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, fontSize: "0.75rem", color: "#2D3748" }}>
              {currentSpec.parserQuirks.map((quirk, idx) => (
                <li key={idx} style={{ marginBottom: "3px" }}>
                  {quirk}
                </li>
              ))}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Main Split Layout: Left Form / Right A4 Preview */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Left Side: Form Editor Sections (Without Sections Nav) */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", lg: "0 0 52%" },
            overflowY: "auto",
            p: 3,
            borderRight: "1px solid #E4E6E8",
            bgcolor: "#F7F7F8"
          }}
        >
          <Box sx={{ maxWidth: 760, mx: "auto" }}>
            {/* Target Job Description Box */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    Target Job Description
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {atsAudit.jobMatchScore !== undefined && atsAudit.jobMatchScore > 0 ? (
                      <Chip
                        label={`Match: ${atsAudit.jobMatchScore}%`}
                        size="small"
                        sx={{ bgcolor: "#DCFCE7", color: "#15803D", fontWeight: 700, fontSize: "0.72rem" }}
                      />
                    ) : (
                      <Chip
                        label="50% of ATS Score"
                        size="small"
                        sx={{ bgcolor: "#FEF3C7", color: "#B45309", fontWeight: 700, fontSize: "0.72rem" }}
                      />
                    )}
                    <Chip
                      label="ATS Keyword Matching"
                      size="small"
                      sx={{ bgcolor: "#F0F2FF", color: "#4F46E5", fontWeight: 600, fontSize: "0.72rem" }}
                    />
                  </Stack>
                </Box>
                <Typography variant="body2" sx={{ color: "#5F6368", mb: 2 }}>
                  Paste the job posting description below. The ATS engine computes 50% of your ATS score from keyword alignment and requirement coverage against this job description.
                </Typography>
                <TextField
                  placeholder="Paste the target job description here (e.g. responsibilities, required skills, tools, qualifications)..."
                  value={currentResume.jobDescription || ""}
                  onChange={(e) => updateActiveResume({ jobDescription: e.target.value })}
                  multiline
                  minRows={4}
                  maxRows={12}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#FFFFFF"
                    }
                  }}
                />
              </CardContent>
            </Card>

            <ContactEditor
              contact={currentResume.contact}
              onChange={(contact) => updateActiveResume({ contact })}
            />

            <SummaryEditor
              summary={currentResume.summary}
              onChange={(summary) => updateActiveResume({ summary })}
            />

            <ExperienceEditor
              experience={currentResume.experience}
              onChange={(experience) => updateActiveResume({ experience })}
            />

            <ProjectsEditor
              projects={currentResume.projects}
              onChange={(projects) => updateActiveResume({ projects })}
            />

            <EducationEditor
              education={currentResume.education}
              onChange={(education) => updateActiveResume({ education })}
            />

            <SkillsEditor
              skills={currentResume.skills}
              onChange={(skills) => updateActiveResume({ skills })}
            />

            <CertificationsEditor
              certifications={currentResume.certifications}
              onChange={(certifications) => updateActiveResume({ certifications })}
            />

            <ResumeSettingsEditor
              settings={currentResume.settings}
              onChange={(settings) => updateActiveResume({ settings })}
              onNext={handleOpenRealChatGPT}
            />
          </Box>
        </Box>

        {/* Right Side: Live A4 ATS Preview */}
        <Box
          sx={{
            flex: { xs: "0 0 0%", lg: "0 0 48%" },
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            bgcolor: "#E9ECEF",
            p: { xs: 1.5, md: 2 }
          }}
        >
          <AtsResumeRenderer resume={currentResume} containerId="ats-resume-document" />
        </Box>
      </Box>

      {/* Notification Snackbar when Real ChatGPT tab is opened */}
      <Snackbar
        open={chatGptSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setChatGptSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setChatGptSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%", borderRadius: 2, fontWeight: 500 }}
        >
          {chatGptSnackbarMsg || "CV PDF downloaded! Drag or attach it into the opened ChatGPT tab."}
        </Alert>
      </Snackbar>
    </Box>
  );
};
