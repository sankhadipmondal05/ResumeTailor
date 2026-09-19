import React from "react";
import { TextField, Typography, Card, CardContent, Box } from "@mui/material";

interface SummaryEditorProps {
  summary: string;
  onChange: (updated: string) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({ summary, onChange }) => {
  const charCount = summary ? summary.length : 0;
  const maxRecommended = 500;

  return (
    <Card id="section-summary" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Professional Summary
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: charCount > maxRecommended ? "#A16207" : "#5F6368",
              fontWeight: 500
            }}
          >
            {charCount} / {maxRecommended} chars
          </Typography>
        </Box>

        <TextField
          multiline
          rows={4}
          fullWidth
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Brief 2-4 sentence overview of your core competencies, key domain experience, and quantifiable career achievements..."
          size="small"
        />
      </CardContent>
    </Card>
  );
};
