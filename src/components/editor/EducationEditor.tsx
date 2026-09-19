import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import {
  AddIcon,
  DeleteOutlineIcon,
  ArrowUpwardIcon,
  ArrowDownwardIcon
} from "../icons/Icons";
import { Education } from "../../types/resume";

interface EducationEditorProps {
  education: Education[];
  onChange: (updated: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ education, onChange }) => {
  const handleAdd = () => {
    const newEntry: Education = {
      id: "edu-" + Date.now().toString(36),
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      details: ""
    };
    onChange([...education, newEntry]);
  };

  const handleUpdate = (index: number, updated: Partial<Education>) => {
    const copy = [...education];
    copy[index] = { ...copy[index], ...updated };
    onChange(copy);
  };

  const handleDelete = (index: number) => {
    const copy = education.filter((_, i) => i !== index);
    onChange(copy);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= education.length) return;
    const copy = [...education];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  return (
    <Card id="section-education" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Education
          </Typography>
          <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={handleAdd}>
            Add Education
          </Button>
        </Box>

        {education.length === 0 && (
          <Typography variant="body2" sx={{ color: "#5F6368", fontStyle: "italic", py: 2 }}>
            No education entries listed yet.
          </Typography>
        )}

        {education.map((edu, index) => (
          <Box
            key={edu.id}
            sx={{
              p: 2.5,
              mb: 2.5,
              border: "1px solid #E4E6E8",
              borderRadius: 2,
              bgcolor: "#FDFDFD"
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#111111" }}>
                Education #{index + 1}: {edu.institution || "Untitled School"}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === education.length - 1}
                  onClick={() => handleMove(index, "down")}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Institution / University"
                  size="small"
                  fullWidth
                  value={edu.institution}
                  onChange={(e) => handleUpdate(index, { institution: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Degree"
                  size="small"
                  fullWidth
                  placeholder="e.g. B.Tech, Bachelor of Science"
                  value={edu.degree}
                  onChange={(e) => handleUpdate(index, { degree: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Major / Field of Study"
                  size="small"
                  fullWidth
                  placeholder="e.g. Computer Science & Engineering"
                  value={edu.field || ""}
                  onChange={(e) => handleUpdate(index, { field: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Graduation Year"
                  size="small"
                  fullWidth
                  placeholder="e.g. 2027"
                  value={edu.endDate || ""}
                  onChange={(e) => handleUpdate(index, { endDate: e.target.value, startDate: "" })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="CGPA (Optional)"
                  size="small"
                  fullWidth
                  placeholder="e.g. 8.33 / 10"
                  value={edu.cgpa ?? edu.gpa ?? ""}
                  onChange={(e) => handleUpdate(index, { cgpa: e.target.value, gpa: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
