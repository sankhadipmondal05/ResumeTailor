import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useResume } from "../../context/ResumeContext";

interface TailorModalProps {
  open: boolean;
  onClose: () => void;
}

export const TailorModal: React.FC<TailorModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { createTailoredCopy } = useResume();

  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !jobTitle.trim()) return;

    const newResume = createTailoredCopy(company.trim(), jobTitle.trim(), jobDescription.trim());
    onClose();
    // Redirect directly to the newly created tailored resume editor
    navigate(`/resumes/${newResume.id}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Create Tailored Resume
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: "#5F6368", mb: 3 }}>
            This generates an independent deep-copy of your Master Resume. Your master resume remains unaltered.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Company Name"
              placeholder="e.g. Stripe, Airbnb, Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              fullWidth
              size="small"
              autoFocus
            />

            <TextField
              label="Target Job Title"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              fullWidth
              size="small"
            />

            <TextField
              label="Job Description (Optional)"
              placeholder="Paste the full job description here to analyze matching keywords..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              multiline
              rows={5}
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} sx={{ color: "#5F6368" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!company.trim() || !jobTitle.trim()}
          >
            Create & Tailor
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
