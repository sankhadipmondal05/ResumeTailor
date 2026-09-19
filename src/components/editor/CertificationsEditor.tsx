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
import { Certification } from "../../types/resume";

interface CertificationsEditorProps {
  certifications: Certification[];
  onChange: (updated: Certification[]) => void;
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({
  certifications,
  onChange
}) => {
  const handleAdd = () => {
    const newEntry: Certification = {
      id: "cert-" + Date.now().toString(36),
      name: "",
      issuer: "",
      date: "",
      url: ""
    };
    onChange([...certifications, newEntry]);
  };

  const handleUpdate = (index: number, updated: Partial<Certification>) => {
    const copy = [...certifications];
    copy[index] = { ...copy[index], ...updated };
    onChange(copy);
  };

  const handleDelete = (index: number) => {
    const copy = certifications.filter((_, i) => i !== index);
    onChange(copy);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= certifications.length) return;
    const copy = [...certifications];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  return (
    <Card id="section-certifications" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Certifications
          </Typography>
          <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={handleAdd}>
            Add Certification
          </Button>
        </Box>

        {certifications.length === 0 && (
          <Typography variant="body2" sx={{ color: "#5F6368", fontStyle: "italic", py: 2 }}>
            No certifications added.
          </Typography>
        )}

        {certifications.map((cert, index) => (
          <Box
            key={cert.id}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid #E4E6E8",
              borderRadius: 2,
              bgcolor: "#FDFDFD"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                gap: 2
              }}
            >
              <Box sx={{ flex: 1.2 }}>
                <TextField
                  label="Certification Name"
                  size="small"
                  fullWidth
                  value={cert.name}
                  placeholder="e.g. AWS Solutions Architect"
                  onChange={(e) => handleUpdate(index, { name: e.target.value })}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Issuer"
                  size="small"
                  fullWidth
                  value={cert.issuer}
                  placeholder="e.g. Amazon Web Services"
                  onChange={(e) => handleUpdate(index, { issuer: e.target.value })}
                  required
                />
              </Box>
              <Box sx={{ width: { xs: "100%", md: "130px" } }}>
                <TextField
                  label="Issue Date"
                  size="small"
                  fullWidth
                  placeholder="e.g. Nov 2023"
                  value={cert.date || ""}
                  onChange={(e) => handleUpdate(index, { date: e.target.value })}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Verification Link"
                  size="small"
                  fullWidth
                  placeholder="Credential URL"
                  value={cert.url || ""}
                  onChange={(e) => handleUpdate(index, { url: e.target.value })}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexShrink: 0, gap: 0.5 }}>
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                  title="Move up"
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === certifications.length - 1}
                  onClick={() => handleMove(index, "down")}
                  title="Move down"
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(index)} title="Delete certification">
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
