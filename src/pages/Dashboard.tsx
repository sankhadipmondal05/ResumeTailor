import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Chip,
  IconButton,
  Tooltip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  AddIcon,
  FileCopyIcon,
  DeleteOutlineIcon
} from "../components/icons/Icons";
import { useResume } from "../context/ResumeContext";
import { TailorModal } from "../components/common/TailorModal";
import { ContactEditor } from "../components/editor/ContactEditor";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { masterResume, tailoredResumes, updateMasterContact, duplicateResume, deleteResume } = useResume();
  const [tailorOpen, setTailorOpen] = useState(false);

  // Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1440, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h1" sx={{ fontSize: "1.75rem", fontWeight: 700, color: "#111111" }}>
            {getGreeting()}
          </Typography>
          <Typography variant="body1" sx={{ color: "#5F6368", mt: 0.5 }}>
            Tailor your resume for your next application.
          </Typography>
        </Box>

        {/* Large button-shaped box displaying Total Active Resumes */}
        <Box
          onClick={() => navigate("/resumes")}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.5,
            px: 3,
            py: 1.25,
            bgcolor: "#F7F7F8",
            border: "1px solid #E4E6E8",
            borderRadius: 2,
            cursor: "pointer",
            transition: "all 0.15s ease-in-out",
            "&:hover": {
              bgcolor: "#F0F2FF",
              borderColor: "#C7D2FE"
            }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#5F6368" }}>
            Total Active Resumes:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#4F46E5", lineHeight: 1 }}>
            {1 + tailoredResumes.length}
          </Typography>
        </Box>
      </Box>

      {/* 2-Column Structure */}
      <Grid container spacing={3.5}>
        {/* Column 1: Master Details (Default Contact Info for all created resumes) */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ height: 32, display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", m: 0 }}>
                Master Details
              </Typography>
              <Chip label="Default for all new resumes" size="small" sx={{ bgcolor: "#F0F2FF", color: "#4F46E5", fontWeight: 600 }} />
            </Box>
            <Typography variant="body2" sx={{ color: "#5F6368", minHeight: 40 }}>
              This information serves as the master default contact info automatically populated across every newly created or tailored CV/resume.
            </Typography>
          </Box>

          <ContactEditor
            contact={masterResume.contact}
            onChange={(updatedContact) => updateMasterContact(updatedContact)}
          />
        </Grid>

        {/* Column 2: Recent Resumes */}
        <Grid item xs={12} lg={6}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ height: 32, display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#111111", m: 0 }}>
                Recent Resumes
              </Typography>
              {tailoredResumes.length > 0 && (
                <Button size="small" onClick={() => navigate("/resumes")}>
                  View All ({tailoredResumes.length})
                </Button>
              )}
            </Box>
            <Typography variant="body2" sx={{ color: "#5F6368", minHeight: 40 }}>
              Manage and edit tailored resumes created for specific roles and company openings.
            </Typography>
          </Box>

          {tailoredResumes.length === 0 ? (
            <Card sx={{ p: 4, textAlign: "center", bgcolor: "#FAFAFA", borderStyle: "dashed" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#111111", mb: 0.5 }}>
                No custom resumes created yet
              </Typography>
              <Typography variant="body2" sx={{ color: "#5F6368", mb: 2 }}>
                Click &ldquo;Create New Resume&rdquo; to build tailored CVs inheriting your master contact details.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setTailorOpen(true)}>
                Create First Resume
              </Button>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {tailoredResumes.slice(0, 4).map((resume) => (
                <Card key={resume.id} sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111111" }}>
                        {resume.company || "Target Company"}
                      </Typography>
                      <Chip label="Tailored" size="small" sx={{ height: 20, fontSize: "0.7rem" }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: "#4F46E5", fontWeight: 600 }}>
                      {resume.jobTitle || "Job Title"}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#8A8F98" }}>
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/resumes/${resume.id}`)}>
                      Edit
                    </Button>
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
                </Card>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>

      <TailorModal open={tailorOpen} onClose={() => setTailorOpen(false)} />
    </Box>
  );
};
