import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Snackbar
} from "@mui/material";
import {
  RestartAltIcon,
  FileDownloadIcon,
  FileUploadIcon
} from "../components/icons/Icons";
import { useResume } from "../context/ResumeContext";
import { storageService } from "../services/storage/storageService";

export const SettingsPage: React.FC = () => {
  const { resetAll, refreshResumes } = useResume();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExportData = () => {
    const data = storageService.loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resumetailor_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage("All resume data exported successfully.");
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.masterResume && Array.isArray(parsed.tailoredResumes)) {
          storageService.saveData(parsed);
          refreshResumes();
          setToastMessage("Data imported successfully!");
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data back to the default sample Master Resume?")) {
      resetAll();
      setToastMessage("Data reset to default sample master resume.");
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 840, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1" sx={{ fontSize: "1.75rem", fontWeight: 700, color: "#111111" }}>
          Settings & Local Data
        </Typography>
        <Typography variant="body1" sx={{ color: "#5F6368", mt: 0.5 }}>
          Manage your browser storage and offline backups.
        </Typography>
      </Box>

      {/* Local Storage Privacy */}
      <Card sx={{ mb: 3, p: 1 }}>
        <CardContent>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 1 }}>
            Privacy & Offline Storage
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6368", mb: 2 }}>
            ResumeTailor operates 100% on your device using client-side <code>localStorage</code>. No resumes, company names, or job descriptions are transmitted to external servers or AI cloud providers.
          </Typography>
          <Alert severity="info">
            Your data is stored locally in your browser. If you clear browser website cache/data, use the backup export feature below to prevent accidental loss.
          </Alert>
        </CardContent>
      </Card>

      {/* Backup & Restore */}
      <Card sx={{ mb: 3, p: 1 }}>
        <CardContent>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 1 }}>
            Backup & Restore
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6368", mb: 3 }}>
            Export all master and tailored resumes to a local JSON file or restore from a previously exported backup.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportData}
            >
              Export JSON Backup
            </Button>

            <Button
              variant="outlined"
              component="label"
              startIcon={<FileUploadIcon />}
            >
              Import JSON Backup
              <input type="file" accept=".json" hidden onChange={handleImportData} />
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card sx={{ p: 1, border: "1px solid #FEE2E2" }}>
        <CardContent>
          <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700, color: "#B42318", mb: 1 }}>
            Reset Application Data
          </Typography>
          <Typography variant="body2" sx={{ color: "#5F6368", mb: 3 }}>
            Revert your Master Resume and clear all tailored copies back to the initial sample dataset.
          </Typography>

          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
          >
            Reset to Initial Sample
          </Button>
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
    </Box>
  );
};
