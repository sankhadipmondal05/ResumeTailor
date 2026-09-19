import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import { SearchIcon, FlashOnIcon } from "../components/icons/Icons";
import { useNavigate } from "react-router-dom";
import { useResume } from "../context/ResumeContext";
import { analyzeJobMatch } from "../services/matcher/jobMatcher";
import { KeywordMatchDisplay } from "../components/matching/KeywordMatchDisplay";

export const JobMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { masterResume, tailoredResumes, createTailoredCopy } = useResume();

  const [selectedResumeId, setSelectedResumeId] = useState<string>("master");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const allResumes = [masterResume, ...tailoredResumes];
  const activeSelected =
    selectedResumeId === "master"
      ? masterResume
      : allResumes.find((r) => r.id === selectedResumeId) || masterResume;

  const matchResult = hasAnalyzed
    ? analyzeJobMatch(activeSelected, jobDescription)
    : null;

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;
    setHasAnalyzed(true);
  };

  const handleCreateAndTailor = () => {
    const copy = createTailoredCopy(
      company || "Target Company",
      jobTitle || "Target Position",
      jobDescription
    );
    navigate(`/resumes/${copy.id}`);
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1440, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ fontSize: "1.75rem", fontWeight: 700, color: "#111111" }}>
          Tailor your resume
        </Typography>
        <Typography variant="body1" sx={{ color: "#5F6368", mt: 0.5 }}>
          Analyze any job description locally to discover matching and missing ATS keywords without external APIs.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Form: Inputs */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, bgcolor: "#FFFFFF" }}>
            <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 2 }}>
              Job Details & Target
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Compare Against Resume</InputLabel>
                <Select
                  value={selectedResumeId}
                  label="Compare Against Resume"
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                  <MenuItem value="master">
                    Master Resume ({masterResume.contact.fullName || "Master"})
                  </MenuItem>
                  {tailoredResumes.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Company Name"
                placeholder="e.g. Netflix, Stripe, Apple"
                size="small"
                fullWidth
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />

              <TextField
                label="Target Job Title"
                placeholder="e.g. Senior Frontend Developer"
                size="small"
                fullWidth
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />

              <TextField
                label="Job Description"
                placeholder="Paste the full job description here..."
                multiline
                rows={10}
                fullWidth
                size="small"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />

              <Button
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
                disabled={!jobDescription.trim()}
                onClick={handleAnalyze}
              >
                Analyze Job Description
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Right Pane: Match Breakdown */}
        <Grid item xs={12} md={6}>
          {matchResult ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <KeywordMatchDisplay match={matchResult} />

              <Card sx={{ p: 2.5, bgcolor: "#F0F2FF", border: "1px solid #C7D2FE" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#3730A3", mb: 0.5 }}>
                  Ready to tailor this role?
                </Typography>
                <Typography variant="body2" sx={{ color: "#4338CA", mb: 2 }}>
                  Create an independent copy with this analysis attached so you can adjust your bullet points and skills directly.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FlashOnIcon />}
                  onClick={handleCreateAndTailor}
                >
                  Create Tailored Copy Now
                </Button>
              </Card>
            </Box>
          ) : (
            <Card sx={{ p: 6, textAlign: "center", bgcolor: "#FAFAFA", borderStyle: "dashed" }}>
              <Typography variant="h6" sx={{ color: "#111111", fontWeight: 600, mb: 1 }}>
                Awaiting Job Description
              </Typography>
              <Typography variant="body2" sx={{ color: "#5F6368" }}>
                Paste a target job opening on the left and click &ldquo;Analyze Job Description&rdquo; to review keyword coverage, matched competencies, and potential gaps.
              </Typography>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
