import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  Chip
} from "@mui/material";
import { ATS_SYSTEMS_CATALOG } from "../../services/parser/atsSystemAuditor";

interface AtsScoreDialCardProps {
  score: number; // 0 to 100
  isLoading?: boolean;
  selectedAts: string;
  onSelectAts: (ats: string) => void;
  onCheck: () => void;
}

// Polar to cartesian coordinate conversion
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians)
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export const AtsScoreDialCard: React.FC<AtsScoreDialCardProps> = ({
  score,
  isLoading = false,
  selectedAts,
  onSelectAts,
  onCheck
}) => {
  const validScore = Math.max(0, Math.min(100, Math.round(score)));
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Menu anchor for ATS System dropdown button
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (validScore - start) * ease);
      setAnimatedScore(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [validScore, isLoading]);

  // Semi-circle arc from -180 deg to 0 deg
  const angle = -180 + (animatedScore / 100) * 180;

  const getScoreColor = (val: number) => {
    if (isLoading) return "#9CA3AF";
    if (val < 40) return "#E53935";
    if (val < 65) return "#F59E0B";
    if (val < 85) return "#10B981";
    return "#059669";
  };

  const getScoreLabel = (val: number) => {
    if (isLoading) return "Analyzing...";
    if (val === 0) return "Ready to Scan";
    if (val < 40) return "Poor Match";
    if (val < 65) return "Needs Work";
    if (val < 85) return "Good Match";
    return "Excellent Match";
  };

  const cx = 100;
  const cy = 95;
  const r = 70;

  // Arc segments for dial
  const bgArc = describeArc(cx, cy, r, 180, 0);

  // Colored progress segments matching reference image
  const seg1 = describeArc(cx, cy, r, 180, 135);
  const seg2 = describeArc(cx, cy, r, 135, 90);
  const seg3 = describeArc(cx, cy, r, 90, 45);
  const seg4 = describeArc(cx, cy, r, 45, 0);

  const currentSpec = ATS_SYSTEMS_CATALOG[selectedAts] || ATS_SYSTEMS_CATALOG.Workday;

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "24px",
        p: { xs: 2.5, sm: 3.5 },
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        border: "1px solid #EEF2F6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#1E293B",
          fontSize: "1.15rem",
          letterSpacing: "-0.01em",
          mb: 1
        }}
      >
        Your Score
      </Typography>

      {/* Speedometer Gauge Graphic */}
      <Box
        sx={{
          position: "relative",
          width: 200,
          height: 115,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          mt: 0.5,
          mb: 1.5
        }}
      >
        <svg viewBox="0 0 200 115" width="200" height="115">
          {/* Subtle Background Arc */}
          <path
            d={bgArc}
            fill="none"
            stroke="#E9ECEF"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {!isLoading && animatedScore > 0 && (
            <>
              {/* Four Gradient Segments */}
              <path d={seg1} fill="none" stroke="#EF4444" strokeWidth="16" />
              <path d={seg2} fill="none" stroke="#F59E0B" strokeWidth="16" />
              <path d={seg3} fill="none" stroke="#10B981" strokeWidth="16" />
              <path d={seg4} fill="none" stroke="#059669" strokeWidth="16" />
            </>
          )}

          {/* Center baseline line */}
          <line
            x1="20"
            y1={cy}
            x2="180"
            y2={cy}
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />

          {/* Pivot dot */}
          <circle cx={cx} cy={cy} r="5" fill="#334155" />

          {/* Needle Arrow */}
          {!isLoading && (
            <g transform={`rotate(${angle} ${cx} ${cy})`}>
              <polygon
                points={`${cx},${cy - 3} ${cx + 64},${cy} ${cx},${cy + 3}`}
                fill="#1E293B"
              />
              <circle cx={cx + 60} cy={cy} r="2.5" fill="#1E293B" />
            </g>
          )}
        </svg>
      </Box>

      {/* Main Score Value Display */}
      <Box sx={{ textAlign: "center", mb: 2.5 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              py: 1
            }}
          >
            <Box
              sx={{
                width: 110,
                height: 22,
                borderRadius: 3,
                bgcolor: "#E2E8F0",
                animation: "pulse 1.5s infinite"
              }}
            />
            <Box
              sx={{
                width: 75,
                height: 16,
                borderRadius: 3,
                bgcolor: "#F1F5F9",
                animation: "pulse 1.5s infinite"
              }}
            />
          </Box>
        ) : (
          <>
            <Typography
              sx={{
                fontSize: "2.65rem",
                fontWeight: 800,
                lineHeight: 1,
                color: getScoreColor(animatedScore),
                fontVariantNumeric: "tabular-nums"
              }}
            >
              {animatedScore}
              <Typography
                component="span"
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#94A3B8",
                  ml: 0.5
                }}
              >
                /100
              </Typography>
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: getScoreColor(animatedScore),
                mt: 0.75
              }}
            >
              {getScoreLabel(animatedScore)}
            </Typography>
          </>
        )}
      </Box>

      {/* Divider */}
      <Box sx={{ width: "100%", height: "1px", bgcolor: "#F1F5F9", mb: 2.5 }} />

      {/* Two Buttons Side by Side: Left = Select ATS System, Right = Check */}
      <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
        {/* Left Button: Select ATS System */}
        <Button
          variant="outlined"
          size="medium"
          onClick={(e) => setMenuAnchorEl(e.currentTarget)}
          disabled={isLoading}
          sx={{
            borderRadius: "14px",
            py: 1.1,
            px: 1,
            fontSize: "0.84rem",
            fontWeight: 700,
            textTransform: "none",
            color: "#1E293B",
            borderColor: "#CBD5E1",
            bgcolor: "#F8FAFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            whiteSpace: "nowrap",
            "&:hover": {
              borderColor: "#94A3B8",
              bgcolor: "#F1F5F9"
            }
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: currentSpec.logoBg,
              flexShrink: 0
            }}
          />
          <Typography
            component="span"
            sx={{
              fontSize: "0.84rem",
              fontWeight: 700,
              maxWidth: "100px",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {currentSpec.name}
          </Typography>
          <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Button>

        {/* Dropdown Menu for ATS Systems */}
        <Menu
          anchorEl={menuAnchorEl}
          open={isMenuOpen}
          onClose={() => setMenuAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
              minWidth: 220,
              mt: 1
            }
          }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #F1F5F9" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
              Select ATS System
            </Typography>
          </Box>
          {Object.values(ATS_SYSTEMS_CATALOG).map((ats) => (
            <MenuItem
              key={ats.key}
              selected={ats.key === selectedAts}
              onClick={() => {
                onSelectAts(ats.key);
                setMenuAnchorEl(null);
              }}
              sx={{ py: 1, px: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, width: "100%" }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: ats.logoBg, flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#0F172A", flexGrow: 1 }}>
                  {ats.name}
                </Typography>
                <Chip
                  label={ats.marketShare}
                  size="small"
                  sx={{ height: 18, fontSize: "0.65rem", fontWeight: 600, bgcolor: "#F1F5F9" }}
                />
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Right Button: Check */}
        <Button
          variant="contained"
          size="medium"
          onClick={onCheck}
          disabled={isLoading}
          sx={{
            borderRadius: "14px",
            py: 1.1,
            px: 1.5,
            fontSize: "0.88rem",
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#4F46E5",
            color: "#FFFFFF",
            boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
            "&:hover": {
              bgcolor: "#4338CA"
            }
          }}
        >
          {isLoading ? "Checking..." : "Check"}
        </Button>
      </Box>
    </Box>
  );
};
