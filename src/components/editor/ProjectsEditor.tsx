import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  Divider
} from "@mui/material";
import {
  AddIcon,
  DeleteOutlineIcon,
  ArrowUpwardIcon,
  ArrowDownwardIcon
} from "../icons/Icons";
import { Project } from "../../types/resume";

interface ProjectsEditorProps {
  projects: Project[];
  onChange: (updated: Project[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ projects, onChange }) => {
  const handleAdd = () => {
    const newEntry: Project = {
      id: "proj-" + Date.now().toString(36),
      name: "",
      url: "",
      technologies: [],
      bullets: [""]
    };
    onChange([...projects, newEntry]);
  };

  const handleUpdate = (index: number, updated: Partial<Project>) => {
    const copy = [...projects];
    copy[index] = { ...copy[index], ...updated };
    onChange(copy);
  };

  const handleDelete = (index: number) => {
    const copy = projects.filter((_, i) => i !== index);
    onChange(copy);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= projects.length) return;
    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  const handleBulletChange = (projIndex: number, bulletIndex: number, text: string) => {
    const copy = [...projects];
    const bullets = [...copy[projIndex].bullets];
    bullets[bulletIndex] = text;
    copy[projIndex].bullets = bullets;
    onChange(copy);
  };

  const handleAddBullet = (projIndex: number) => {
    const copy = [...projects];
    copy[projIndex].bullets = [...copy[projIndex].bullets, ""];
    onChange(copy);
  };

  const handleDeleteBullet = (projIndex: number, bulletIndex: number) => {
    const copy = [...projects];
    copy[projIndex].bullets = copy[projIndex].bullets.filter((_, i) => i !== bulletIndex);
    onChange(copy);
  };

  return (
    <Card id="section-projects" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Projects
          </Typography>
          <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={handleAdd}>
            Add Project
          </Button>
        </Box>

        {projects.length === 0 && (
          <Typography variant="body2" sx={{ color: "#5F6368", fontStyle: "italic", py: 2 }}>
            No personal or open-source projects listed yet.
          </Typography>
        )}

        {projects.map((proj, index) => (
          <Box
            key={proj.id}
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
                Project #{index + 1}: {proj.name || "Untitled Project"}
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
                  disabled={index === projects.length - 1}
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
                  label="Project Name"
                  size="small"
                  fullWidth
                  value={proj.name}
                  onChange={(e) => handleUpdate(index, { name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="URL / Repository"
                  size="small"
                  fullWidth
                  placeholder="github.com/username/project"
                  value={proj.url || ""}
                  onChange={(e) => handleUpdate(index, { url: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Technologies Used (Comma-separated)"
                  size="small"
                  fullWidth
                  placeholder="React, TypeScript, Docker, PostgreSQL"
                  value={proj.technologies ? proj.technologies.join(", ") : ""}
                  onChange={(e) =>
                    handleUpdate(index, {
                      technologies: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    })
                  }
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" sx={{ fontWeight: 600, color: "#111111", mb: 1 }}>
              Project Accomplishments / Architectural Highlights
            </Typography>

            {proj.bullets.map((bullet, bIndex) => (
              <Box key={bIndex} sx={{ display: "flex", gap: 1, mb: 1.25, alignItems: "flex-start" }}>
                <TextField
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                  value={bullet}
                  placeholder="e.g. Developed high-throughput message streaming queue delivering 99.99% uptime..."
                  onChange={(e) => handleBulletChange(index, bIndex, e.target.value)}
                />
                <IconButton
                  size="small"
                  onClick={() => handleDeleteBullet(index, bIndex)}
                  sx={{ mt: 0.5 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

            <Button
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleAddBullet(index)}
              sx={{ mt: 0.5, color: "#4F46E5" }}
            >
              Add Bullet Point
            </Button>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
