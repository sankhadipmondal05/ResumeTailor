import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
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
import { Experience } from "../../types/resume";

interface ExperienceEditorProps {
  experience: Experience[];
  onChange: (updated: Experience[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experience, onChange }) => {
  const handleAdd = () => {
    const newEntry: Experience = {
      id: "exp-" + Date.now().toString(36),
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""]
    };
    onChange([newEntry, ...experience]);
  };

  const handleUpdate = (index: number, updated: Partial<Experience>) => {
    const copy = [...experience];
    copy[index] = { ...copy[index], ...updated };
    onChange(copy);
  };

  const handleDelete = (index: number) => {
    const copy = experience.filter((_, i) => i !== index);
    onChange(copy);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= experience.length) return;
    const copy = [...experience];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  const handleBulletChange = (expIndex: number, bulletIndex: number, text: string) => {
    const copy = [...experience];
    const bullets = [...copy[expIndex].bullets];
    bullets[bulletIndex] = text;
    copy[expIndex].bullets = bullets;
    onChange(copy);
  };

  const handleAddBullet = (expIndex: number) => {
    const copy = [...experience];
    copy[expIndex].bullets = [...copy[expIndex].bullets, ""];
    onChange(copy);
  };

  const handleDeleteBullet = (expIndex: number, bulletIndex: number) => {
    const copy = [...experience];
    copy[expIndex].bullets = copy[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    onChange(copy);
  };

  return (
    <Card id="section-experience" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Work Experience
          </Typography>
          <Button
            startIcon={<AddIcon />}
            size="small"
            variant="outlined"
            onClick={handleAdd}
          >
            Add Position
          </Button>
        </Box>

        {experience.length === 0 && (
          <Typography variant="body2" sx={{ color: "#5F6368", fontStyle: "italic", py: 2 }}>
            No work experience added yet. Click &ldquo;Add Position&rdquo; to add your roles.
          </Typography>
        )}

        {experience.map((exp, index) => (
          <Box
            key={exp.id}
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
                Position #{index + 1}: {exp.role || "Untitled Role"}
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
                  disabled={index === experience.length - 1}
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
                  label="Company Name"
                  size="small"
                  fullWidth
                  value={exp.company}
                  onChange={(e) => handleUpdate(index, { company: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Title / Role"
                  size="small"
                  fullWidth
                  value={exp.role}
                  onChange={(e) => handleUpdate(index, { role: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Location"
                  size="small"
                  fullWidth
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  value={exp.location || ""}
                  onChange={(e) => handleUpdate(index, { location: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Start Date"
                  size="small"
                  fullWidth
                  placeholder="e.g. Jan 2022"
                  value={exp.startDate}
                  onChange={(e) => handleUpdate(index, { startDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="End Date"
                  size="small"
                  fullWidth
                  placeholder="e.g. Dec 2023"
                  value={exp.endDate || ""}
                  disabled={exp.current}
                  onChange={(e) => handleUpdate(index, { endDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={exp.current}
                      onChange={(e) =>
                        handleUpdate(index, { current: e.target.checked, endDate: e.target.checked ? "" : exp.endDate })
                      }
                    />
                  }
                  label={<Typography variant="body2">Current</Typography>}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Bullets */}
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#111111", mb: 1 }}>
              Key Accomplishments & Responsibilities (Action Verb + Context + Result)
            </Typography>

            {exp.bullets.map((bullet, bIndex) => (
              <Box key={bIndex} sx={{ display: "flex", gap: 1, mb: 1.25, alignItems: "flex-start" }}>
                <TextField
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                  placeholder="e.g. Architected microservices with Node.js and TypeScript, reducing API latency by 35%..."
                  value={bullet}
                  onChange={(e) => handleBulletChange(index, bIndex, e.target.value)}
                />
                <IconButton
                  size="small"
                  color="default"
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
