import React from "react";
import { List, ListItem, ListItemButton, ListItemText, Typography, Paper } from "@mui/material";

interface SectionNavProps {
  activeSection?: string;
}

export const SectionNav: React.FC<SectionNavProps> = () => {
  const sections = [
    { id: "section-contact", label: "Contact" },
    { id: "section-summary", label: "Summary" },
    { id: "section-experience", label: "Experience" },
    { id: "section-projects", label: "Projects" },
    { id: "section-education", label: "Education" },
    { id: "section-skills", label: "Skills" },
    { id: "section-certifications", label: "Certifications" },
    { id: "section-settings", label: "Formatting" }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <Paper
      sx={{
        p: 1.5,
        border: "1px solid #E4E6E8",
        position: "sticky",
        top: 24,
        bgcolor: "#FFFFFF"
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700, color: "#8A8F98", px: 1, textTransform: "uppercase" }}>
        Sections
      </Typography>
      <List dense disablePadding sx={{ mt: 1 }}>
        {sections.map((sec) => (
          <ListItem key={sec.id} disablePadding>
            <ListItemButton
              onClick={() => scrollTo(sec.id)}
              sx={{
                py: 0.5,
                px: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "#F7F7F8" }
              }}
            >
              <ListItemText
                primary={sec.label}
                primaryTypographyProps={{ fontSize: "0.85rem", color: "#111111", fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
