import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

interface AtsSpeedometerProps {
  score: number; // 0 to 100
  parsabilityScore?: number;
  jobMatchScore?: number;
  resetTrigger?: any; // To trigger 0 -> score animation whenever system changes
  size?: number;
}

// Helper to convert polar coordinates (degrees) to Cartesian (x, y)
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians)
  };
}

// Describe SVG arc path between two angles (in standard math degrees: 180 = left, 90 = top, 0 = right)
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export const AtsSpeedometer: React.FC<AtsSpeedometerProps> = ({
  score,
  parsabilityScore,
  jobMatchScore,
  resetTrigger,
  size = 56
}) => {
  // Clamp score between 0 and 100
  const validScore = Math.max(0, Math.min(100, Math.round(score)));

  // Animated display score counting up from 0
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400; // ms: smooth, gradual animation as requested
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // smooth easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (validScore - start) * ease);
      setAnimatedScore(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [validScore, resetTrigger]);

  // Semi-circle arc from -180 deg (left) to 0 deg (right)
  const angle = -180 + (animatedScore / 100) * 180;

  const getScoreColor = (val: number) => {
    if (val < 40) return "#E53935"; // Red
    if (val < 65) return "#FBC02D"; // Yellow-Orange
    if (val < 85) return "#4CAF50"; // Green
    return "#1B5E20"; // Dark Green
  };

  const getScoreLabel = (val: number) => {
    if (val < 40) return "Poor";
    if (val < 65) return "Needs Work";
    if (val < 85) return "Good";
    return "Excellent";
  };

  const cx = 50;
  const cy = 48;
  const r = 38;

  const seg1 = describeArc(cx, cy, r, 185, 141);
  const seg2 = describeArc(cx, cy, r, 133, 94);
  const seg3 = describeArc(cx, cy, r, 86, 47);
  const seg4 = describeArc(cx, cy, r, 39, -5);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        height: 36 // Exact button height
      }}
    >
      {/* Dial wrapper vertically centered */}
      <Box
        sx={{
          position: "relative",
          width: size,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}
      >
        <svg
          viewBox="0 0 100 56"
          width={size}
          height={32}
          style={{ display: "block" }}
        >
          {/* Segment 1: Red (Poor) */}
          <path
            d={seg1}
            fill="none"
            stroke="#E53935"
            strokeWidth="12"
          />

          {/* Segment 2: Yellow (Needs Work) */}
          <path
            d={seg2}
            fill="none"
            stroke="#FBC02D"
            strokeWidth="12"
          />

          {/* Segment 3: Light Green (Good) */}
          <path
            d={seg3}
            fill="none"
            stroke="#66BB6A"
            strokeWidth="12"
          />

          {/* Segment 4: Dark Green (Excellent) */}
          <path
            d={seg4}
            fill="none"
            stroke="#2E7D32"
            strokeWidth="12"
          />

          {/* Needle Center Pivot */}
          <circle cx={cx} cy={cy} r="4.5" fill="#2D3748" />

          {/* Needle Arrow */}
          <g transform={`rotate(${angle} ${cx} ${cy})`}>
            <polygon
              points={`${cx},${cy - 2.5} ${cx + 36},${cy} ${cx},${cy + 2.5}`}
              fill="#1A202C"
            />
            <circle cx={cx + 34} cy={cy} r="1.5" fill="#1A202C" />
          </g>
        </svg>
      </Box>

      {/* Fixed-width & height text block vertically centered with dial */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 72,
          height: 36,
          flexShrink: 0
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline", gap: "2px", lineHeight: 1 }}>
          <Typography
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: "1.05rem",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              color: getScoreColor(animatedScore)
            }}
          >
            {animatedScore}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: "#8A8F98",
              fontWeight: 600,
              fontSize: "0.72rem",
              lineHeight: 1
            }}
          >
            /100
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: "3px" }}>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              color: getScoreColor(animatedScore),
              lineHeight: 1,
              whiteSpace: "nowrap"
            }}
          >
            {getScoreLabel(animatedScore)}
          </Typography>

          {parsabilityScore !== undefined && (
            <Typography
              component="span"
              sx={{
                fontSize: "0.58rem",
                fontWeight: 600,
                color: "#6B7280",
                lineHeight: 1,
                whiteSpace: "nowrap"
              }}
            >
              • Parsed: {parsabilityScore}%
              {jobMatchScore !== undefined ? ` • JD: ${jobMatchScore}%` : ""}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
