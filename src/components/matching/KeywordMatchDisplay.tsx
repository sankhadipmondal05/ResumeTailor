import React from "react";
import { Box, Typography, Chip, Paper, LinearProgress, Stack } from "@mui/material";
import { CheckCircleIcon, ErrorOutlineIcon, AutoAwesomeIcon } from "../icons/Icons";
import { JobMatch } from "../../types/matching";

interface KeywordMatchDisplayProps {
  match: JobMatch;
}

export const KeywordMatchDisplay: React.FC<KeywordMatchDisplayProps> = ({ match }) => {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "#16803C";
    if (score >= 45) return "#A16207";
    return "#B42318";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {/* Score Header */}
      <Paper sx={{ p: 2.5, border: "1px solid #E4E6E8", bgcolor: "#FFFFFF" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111111" }}>
            Job Relevance Score
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: getScoreColor(match.score) }}>
            {match.score}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={match.score}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "#F0F2F5",
            "& .MuiLinearProgress-bar": {
              bgcolor: getScoreColor(match.score)
            }
          }}
        />
        <Typography variant="caption" sx={{ color: "#5F6368", mt: 1, display: "block" }}>
          Calculated by comparing recognized technical skills, tools, and methodologies in your resume vs. the job description.
        </Typography>
      </Paper>

      {/* Matched Keywords */}
      <Paper sx={{ p: 2.5, border: "1px solid #E4E6E8", bgcolor: "#FFFFFF" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <CheckCircleIcon sx={{ color: "#16803C", fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111111" }}>
            Matched Keywords ({match.matchedKeywords.length})
          </Typography>
        </Box>
        {match.matchedKeywords.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#5F6368", fontStyle: "italic" }}>
            No overlapping keywords detected yet.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {match.matchedKeywords.map((kw) => (
              <Chip
                key={kw}
                label={kw}
                size="small"
                sx={{
                  bgcolor: "#EAF6ED",
                  color: "#16803C",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  border: "1px solid #C8E8CE"
                }}
              />
            ))}
          </Box>
        )}
      </Paper>

      {/* Missing Keywords */}
      <Paper sx={{ p: 2.5, border: "1px solid #E4E6E8", bgcolor: "#FFFFFF" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <ErrorOutlineIcon sx={{ color: "#A16207", fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111111" }}>
            Potentially Missing Keywords ({match.missingKeywords.length})
          </Typography>
        </Box>
        {match.missingKeywords.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#16803C", fontWeight: 500 }}>
            Great job! No key technical terms from the job post appear missing in your resume.
          </Typography>
        ) : (
          <>
            <Typography variant="body2" sx={{ color: "#5F6368", mb: 1.5 }}>
              If you have verifiable experience with these technologies or methodologies, consider adding them to your skills or experience bullets:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {match.missingKeywords.map((kw) => (
                <Chip
                  key={kw}
                  label={kw}
                  size="small"
                  sx={{
                    bgcolor: "#FEF7EC",
                    color: "#A16207",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    border: "1px solid #F8E0B5"
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Paper>

      {/* Grounding & Ethics notice */}
      <Paper sx={{ p: 2, bgcolor: "#F7F7F8", border: "1px solid #E4E6E8" }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <AutoAwesomeIcon sx={{ fontSize: 18, color: "#4F46E5", mt: 0.2 }} />
          <Typography variant="caption" sx={{ color: "#5F6368" }}>
            <strong>ATS Integrity Principle:</strong> ResumeTailor never fabricates qualifications or injects invisible text. Only add keywords for proficiencies you can personally substantiate in an interview.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};
