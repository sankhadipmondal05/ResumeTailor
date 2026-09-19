import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography
} from "@mui/material";
import { ResumeSettings } from "../../types/resume";

interface ResumeSettingsEditorProps {
  settings: ResumeSettings;
  onChange: (updated: ResumeSettings) => void;
  onNext?: () => void;
}

export const ResumeSettingsEditor: React.FC<ResumeSettingsEditorProps> = ({
  settings,
  onChange,
  onNext
}) => {
  return (
    <Card id="section-settings" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 1 }}>
          Document & ATS Typography Settings
        </Typography>
        <Typography variant="body2" sx={{ color: "#5F6368", mb: 3 }}>
          ATS-compatible fonts and spacing rules ensuring compliant standard A4 dimensions.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Font Family</InputLabel>
              <Select
                value={settings.fontFamily || "Inter"}
                label="Font Family"
                onChange={(e) =>
                  onChange({
                    ...settings,
                    fontFamily: e.target.value as "Inter" | "Aptos" | "Arial" | "Calibri" | "Georgia"
                  })
                }
              >
                <MenuItem value="Inter">Inter (Clean Modern Sans)</MenuItem>
                <MenuItem value="Aptos">Aptos (New Standard Sans)</MenuItem>
                <MenuItem value="Arial">Arial (Standard Sans)</MenuItem>
                <MenuItem value="Calibri">Calibri (Modern Sans)</MenuItem>
                <MenuItem value="Georgia">Georgia (Classic Serif)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#111111" }}>
                Font Size: {settings.fontSize}pt
              </Typography>
            </Box>
            <Slider
              value={settings.fontSize || 10.5}
              min={8.5}
              max={12}
              step={0.25}
              onChange={(_, val) => onChange({ ...settings, fontSize: val as number })}
              size="small"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#111111" }}>
                Line Height: {settings.lineHeight}
              </Typography>
            </Box>
            <Slider
              value={settings.lineHeight || 1.15}
              min={1.1}
              max={1.5}
              step={0.05}
              onChange={(_, val) => onChange({ ...settings, lineHeight: val as number })}
              size="small"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#111111" }}>
                Page Margins: {settings.margin}mm (0.65")
              </Typography>
            </Box>
            <Slider
              value={settings.margin || 16.5}
              min={8}
              max={24}
              step={0.5}
              onChange={(_, val) => onChange({ ...settings, margin: val as number })}
              size="small"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#111111" }}>
                Section Spacing: {settings.sectionSpacing}pt
              </Typography>
            </Box>
            <Slider
              value={settings.sectionSpacing || 12}
              min={3}
              max={24}
              step={1}
              onChange={(_, val) => onChange({ ...settings, sectionSpacing: val as number })}
              size="small"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#111111" }}>
                Letter Spacing: {settings.letterSpacing ?? 0}pt
              </Typography>
            </Box>
            <Slider
              value={settings.letterSpacing ?? 0}
              min={-0.5}
              max={1.0}
              step={0.05}
              onChange={(_, val) => onChange({ ...settings, letterSpacing: Number((val as number).toFixed(2)) })}
              size="small"
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() => {
                onChange({
                  ...settings,
                  fontFamily: "Inter",
                  fontSize: 10.5,
                  lineHeight: 1.15,
                  margin: 16.5,
                  sectionSpacing: 12,
                  letterSpacing: 0
                });
              }}
              sx={{
                height: 38,
                borderRadius: 2,
                borderColor: "#4F46E5",
                color: "#4F46E5",
                fontWeight: 700,
                fontSize: "0.82rem",
                bgcolor: "#F0F2FF",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#E0E7FF",
                  borderColor: "#4338CA"
                }
              }}
            >
              Reset to Standard ATS Typography (10.5pt, 1.15 Line Height, 0.65" Margins)
            </Button>

            <Button
              variant="outlined"
              fullWidth
              size="small"
              onClick={() => {
                onChange({
                  ...settings,
                  fontSize: 9.5,
                  lineHeight: 1.15,
                  margin: 12,
                  sectionSpacing: 8,
                  letterSpacing: 0
                });
              }}
              sx={{
                height: 38,
                borderRadius: 2,
                borderColor: "#10B981",
                color: "#059669",
                fontWeight: 700,
                fontSize: "0.82rem",
                bgcolor: "#ECFDF5",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#D1FAE5",
                  borderColor: "#047857"
                }
              }}
            >
              ⚡ Auto-Fit to Single Page (Compact ATS)
            </Button>
          </Grid>
        </Grid>

        {/* Next Button triggering Mini ChatGPT Chrome Tab */}
        {onNext && (
          <Box
            sx={{
              mt: 3.5,
              pt: 2.5,
              borderTop: "1px solid #E4E6E8",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#111111" }}>
                AI Tailoring & Job Alignment
              </Typography>
              <Typography variant="caption" sx={{ color: "#5F6368" }}>
                Generates your CV PDF file and opens real ChatGPT ready with prompt & target job description.
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={onNext}
              sx={{
                bgcolor: "#10A37F",
                color: "#FFFFFF",
                fontWeight: 700,
                px: 3,
                py: 1,
                borderRadius: 2,
                fontSize: "0.88rem",
                boxShadow: "0 2px 8px rgba(16, 163, 127, 0.25)",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  bgcolor: "#0E906F",
                  boxShadow: "0 4px 12px rgba(16, 163, 127, 0.35)"
                }
              }}
            >
              Next: Tailor in ChatGPT ➔
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
