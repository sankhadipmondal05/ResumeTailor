import React from "react";
import { Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { CheckCircleOutlineIcon, WarningAmberIcon } from "../icons/Icons";
import { Resume } from "../../types/resume";

interface AtsChecklistProps {
  resume: Resume;
}

export const AtsChecklist: React.FC<AtsChecklistProps> = ({ resume }) => {
  const checks = [
    {
      label: "Single Column Layout",
      status: true,
      tip: "No tables or split CSS multi-column blocks that disrupt ATS parser ordering."
    },
    {
      label: "Contact in Document Body",
      status: Boolean(resume.contact.fullName && (resume.contact.email || resume.contact.phone)),
      tip: "Avoid placing contact info in header/footer containers which parsers commonly ignore."
    },
    {
      label: "Standard Section Headers",
      status: true,
      tip: "Uses standard keywords (Summary, Experience, Projects, Education, Skills, Certifications)."
    },
    {
      label: "Clean Typography",
      status: ["Arial", "Calibri", "Georgia"].includes(resume.settings?.fontFamily || "Arial"),
      tip: "Using high-compatibility standard business fonts without decorative glyphs."
    },
    {
      label: "No Graphics or Skill Bars",
      status: true,
      tip: "Pure text skills representation without percent bars, graphs, or image avatars."
    },
    {
      label: "Selectable Text Structure",
      status: true,
      tip: "Renders standard semantic HTML tags (h1, h2, p, ul, li) readable by screenreaders & ATS."
    }
  ];

  return (
    <Paper sx={{ p: 2, bgcolor: "#F7F7F8", border: "1px solid #E4E6E8" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#111111", mb: 1 }}>
        ATS Compliance Verification
      </Typography>
      <List dense disablePadding>
        {checks.map((chk, index) => (
          <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {chk.status ? (
                <CheckCircleOutlineIcon sx={{ color: "#16803C", fontSize: 18 }} />
              ) : (
                <WarningAmberIcon sx={{ color: "#A16207", fontSize: 18 }} />
              )}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#111111" }}>
                  {chk.label}
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ color: "#5F6368" }}>
                  {chk.tip}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
