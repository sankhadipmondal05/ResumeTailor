import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  EditIcon,
  FileCopyIcon,
  DeleteOutlineIcon
} from "../components/icons/Icons";

import { useResume } from "../context/ResumeContext";
import { TailorModal } from "../components/common/TailorModal";

export const ResumeList: React.FC = () => {
  const navigate = useNavigate();
  const { masterResume, tailoredResumes, duplicateResume, deleteResume } = useResume();
  const [tailorOpen, setTailorOpen] = useState(false);

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1440, mx: "auto" }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: "1.75rem", fontWeight: 700, color: "#111111" }}>
            My Resumes
          </Typography>
          <Typography variant="body1" sx={{ color: "#5F6368", mt: 0.5 }}>
            Create, edit, duplicate, and download your ATS-compliant resumes.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTailorOpen(true)}
        >
          New Resume
        </Button>
      </Box>

      {/* Primary Resume */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111111", mb: 1.5 }}>
        Primary Resume
      </Typography>
      <Card sx={{ p: 2.5, mb: 4, bgcolor: "#FFFFFF", border: "1px solid #E4E6E8" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {masterResume.name}
              </Typography>
              <Chip label="Default Profile" size="small" sx={{ bgcolor: "#F0F2FF", color: "#4F46E5", fontWeight: 600 }} />
            </Box>
            <Typography variant="body2" sx={{ color: "#5F6368", mt: 0.5 }}>
              Candidate: {masterResume.contact.fullName} • {masterResume.contact.title || "No Title"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#8A8F98" }}>
              Last saved: {new Date(masterResume.updatedAt).toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate("/resumes/master")}
            >
              Edit Resume
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Additional Resumes */}
      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111111", mb: 1.5 }}>
        Custom Resumes ({tailoredResumes.length})
      </Typography>

      {tailoredResumes.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", bgcolor: "#FAFAFA", borderStyle: "dashed" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#111111", mb: 0.5 }}>
            No tailored resumes yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6368", mb: 2 }}>
            Tailor a resume for each role to increase keyword relevance and ATS scan accuracy.
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setTailorOpen(true)}>
            Create Tailored Resume
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {tailoredResumes.map((resume) => (
            <Grid item xs={12} sm={6} md={4} key={resume.id}>
              <Card sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#111111" }}>
                      {resume.company || "Target Company"}
                    </Typography>
                    <Chip label="Tailored" size="small" sx={{ bgcolor: "#F0F2FF", color: "#4F46E5", fontWeight: 600 }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: "#4F46E5", fontWeight: 600, mb: 1 }}>
                    {resume.jobTitle || "Job Title"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#5F6368", display: "block" }}>
                    Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </Typography>
                  {resume.jobDescription && (
                    <Chip
                      label="Job Description Attached"
                      size="small"
                      sx={{ mt: 1, fontSize: "0.7rem", height: 20, bgcolor: "#EAF6ED", color: "#16803C" }}
                    />
                  )}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3, pt: 1.5, borderTop: "1px solid #F0F2F5" }}>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/resumes/${resume.id}`)}>
                    Edit & Preview
                  </Button>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Duplicate">
                      <IconButton size="small" onClick={() => duplicateResume(resume.id)}>
                        <FileCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => deleteResume(resume.id)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <TailorModal open={tailorOpen} onClose={() => setTailorOpen(false)} />
    </Box>
  );
};
