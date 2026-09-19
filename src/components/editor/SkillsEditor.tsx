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
import { SkillCategory } from "../../types/resume";

interface SkillsEditorProps {
  skills: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onChange }) => {
  const handleAdd = () => {
    const newCat: SkillCategory = {
      id: "sk-" + Date.now().toString(36),
      name: "Tools & Technologies",
      skills: []
    };
    onChange([...skills, newCat]);
  };

  const handleUpdate = (index: number, updated: Partial<SkillCategory>) => {
    const copy = [...skills];
    copy[index] = { ...copy[index], ...updated };
    onChange(copy);
  };

  const handleDelete = (index: number) => {
    const copy = skills.filter((_, i) => i !== index);
    onChange(copy);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= skills.length) return;
    const copy = [...skills];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  return (
    <Card id="section-skills" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Skills (ATS Text Categories)
          </Typography>
          <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={handleAdd}>
            Add Category
          </Button>
        </Box>

        <Typography variant="body2" sx={{ color: "#5F6368", mb: 2 }}>
          ATS-safe resume parsers extract skills as comma-separated lists under categorized headers. No progress bars or ratings.
        </Typography>

        {skills.map((cat, index) => (
          <Box
            key={cat.id}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid #E4E6E8",
              borderRadius: 2,
              bgcolor: "#FDFDFD"
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Category Name"
                  size="small"
                  fullWidth
                  value={cat.name}
                  placeholder="e.g. Languages, Frameworks, Cloud"
                  onChange={(e) => handleUpdate(index, { name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <TextField
                  label="Skills (Comma-separated)"
                  size="small"
                  fullWidth
                  placeholder="e.g. TypeScript, React, Docker, PostgreSQL"
                  value={cat.skills.join(", ")}
                  onChange={(e) =>
                    handleUpdate(index, {
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={1} sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === skills.length - 1}
                  onClick={() => handleMove(index, "down")}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
