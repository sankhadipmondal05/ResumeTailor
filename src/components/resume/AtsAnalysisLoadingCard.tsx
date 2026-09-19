import React, { useEffect, useState } from "react";
import { Box, Typography, keyframes } from "@mui/material";

interface LoadingStep {
  id: string;
  label: string;
}

const STEPS: LoadingStep[] = [
  { id: "parsing", label: "Parsing your resume" },
  { id: "experience", label: "Analyzing your experience" },
  { id: "skills", label: "Extracting your skills" },
  { id: "recommendations", label: "Generating recommendations" }
];

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.8; }
`;

interface AtsAnalysisLoadingCardProps {
  onComplete?: () => void;
}

export const AtsAnalysisLoadingCard: React.FC<AtsAnalysisLoadingCardProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete?.();
          }, 600);
          return prev;
        }
      });
    }, 700); // 700ms per step = ~2.8s total realistic parsing sequence

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <Box
      sx={{
        bgcolor: "#EEF2F9", // Soft pastel blue/lavender background matching screenshot
        borderRadius: "28px",
        p: { xs: 3, md: 5 },
        height: "100%",
        minHeight: 460,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        border: "1px solid #E2E8F0"
      }}
    >
      <Box sx={{ maxWidth: 440, mx: "auto", width: "100%" }}>
        {STEPS.map((step, idx) => {
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2.25,
                  py: 1.75,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              >
                {/* Purple check icon container matching screenshot */}
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    bgcolor: isDone ? "#EEF2FF" : "transparent",
                    border: isDone ? "2px solid #6366F1" : "2px solid #CBD5E1",
                    color: isDone ? "#6366F1" : "#94A3B8",
                    animation: isCurrent ? `${pulse} 1.2s infinite` : "none",
                    transition: "all 0.25s ease"
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </Box>

                {/* Step label */}
                <Typography
                  sx={{
                    fontSize: "1.18rem",
                    fontWeight: isDone ? 600 : 500,
                    color: isDone ? "#0F172A" : "#64748B",
                    letterSpacing: "-0.01em",
                    transition: "color 0.25s ease"
                  }}
                >
                  {step.label}
                </Typography>
              </Box>

              {/* Subtle divider line between items matching screenshot */}
              {idx < STEPS.length - 1 && (
                <Box
                  sx={{
                    ml: 6.25,
                    width: "calc(100% - 50px)",
                    height: "1px",
                    bgcolor: "rgba(226, 232, 240, 0.6)",
                    my: 0.5
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
};
