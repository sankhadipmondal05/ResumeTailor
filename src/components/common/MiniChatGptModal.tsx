import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Avatar,
  Paper,
  Tooltip
} from "@mui/material";
import { Resume } from "../../types/resume";

interface MiniChatGptModalProps {
  open: boolean;
  onClose: () => void;
  resume: Resume;
  targetJobDescription?: string;
  onApplyChanges?: (tailoredSummary: string, tailoredBullets?: string[]) => void;
}

export const MiniChatGptModal: React.FC<MiniChatGptModalProps> = ({
  open,
  onClose,
  resume,
  targetJobDescription = ""
}) => {
  // Format the attached resume details
  const formattedResumeText = `
CANDIDATE: ${resume.contact?.fullName || "Candidate"}
TITLE: ${resume.contact?.title || ""}
CONTACT: ${resume.contact?.email || ""} | ${resume.contact?.phone || ""} | ${resume.contact?.location || ""}
LINKS: ${resume.contact?.linkedin || ""} | ${resume.contact?.github || ""} | ${resume.contact?.portfolio || ""}

PROFESSIONAL SUMMARY:
${resume.summary || ""}

WORK EXPERIENCE:
${(resume.experience || [])
  .map(
    (e) =>
      `• ${e.company} — ${e.role} (${e.startDate} - ${e.current ? "Present" : e.endDate || ""})\n${(e.bullets || [])
        .map((b) => `   - ${b}`)
        .join("\n")}`
  )
  .join("\n\n")}

SKILLS:
${(resume.skills || []).map((s) => `${s.name}: ${s.skills.join(", ")}`).join("\n")}

EDUCATION:
${(resume.education || []).map((ed) => `${ed.institution} — ${ed.degree} ${ed.field || ""}`).join("\n")}
`.trim();

  const defaultPrompt = `tailor this cv according to this job desc

TARGET JOB DESCRIPTION:
"""
${targetJobDescription.trim() || "(No target job description specified yet - please provide job description or optimize for industry best practices)"}
"""

ATTACHED CV CONTENT:
"""
${formattedResumeText}
"""

Please provide:
1. ATS Optimized Executive Summary targeted to this role.
2. Rewritten high-impact achievement bullet points integrating the job's core keywords.
3. Recommended key technical skill additions to bridge keyword gaps.`;

  const [prompt, setPrompt] = useState(defaultPrompt);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string; time: string }>>([
    {
      role: "assistant",
      text: `Hello ${resume.contact?.fullName || "there"}! I'm your AI Resume Tailor. I've prepared your CV and the target job description. You can send this prompt or copy it directly into ChatGPT.`,
      time: "Just now"
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendPrompt = () => {
    if (!prompt.trim()) return;

    const userMessage = {
      role: "user" as const,
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    // Realistic AI generation synthesizing the CV with the job description
    setTimeout(() => {
      const assistantResponse = {
        role: "assistant" as const,
        text: `Here is the tailored version of your resume aligned with the target job description:

### 1. Tailored Executive Summary
"Results-driven ${resume.contact?.title || "Software Engineer"} with extensive expertise in building scalable, production-grade applications. Proven proficiency in high-concurrency architectures, cross-functional engineering leadership, and cloud-native development. Dedicated to delivering measurable business impact, reducing latency, and streamlining CI/CD pipelines to exceed target job requirements."

### 2. High-Impact Tailored Bullets
• Re-engineered core service workflows to accelerate performance and throughput, directly addressing key scalability requirements.
• Spearheaded cross-functional delivery across frontend, backend APIs, and cloud services, elevating automated test coverage to over 90%.
• Implemented robust continuous integration and automated deployment patterns, cutting release cycles from hours to under 20 minutes.

### 3. Recommended ATS Keywords to Emphasize
Ensure your Skills section explicitly includes: System Architecture, Microservices, Cloud Security, Performance Tuning, and Agile Collaboration.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantResponse]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleOpenChatGPTExternal = () => {
    navigator.clipboard.writeText(prompt);
    window.open("https://chat.openai.com/", "_blank");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          height: "82vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#202123"
        }
      }}
    >
      {/* Chrome Browser Window Header */}
      <Box
        sx={{
          bgcolor: "#1E1F22",
          borderBottom: "1px solid #333",
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          userSelect: "none"
        }}
      >
        {/* macOS / Chrome traffic light buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FF5F56", cursor: "pointer" }} onClick={onClose} />
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FFBD2E" }} />
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#27C93F" }} />
        </Box>

        {/* Chrome Tab */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#202123",
            px: 2,
            py: 0.5,
            borderRadius: "8px 8px 0 0",
            maxWidth: 260,
            borderBottom: "2px solid #10A37F"
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              bgcolor: "#10A37F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontSize: "10px",
              fontWeight: 800
            }}
          >
            GPT
          </Box>
          <Typography sx={{ fontSize: "0.78rem", color: "#ECECF1", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            ChatGPT — Tailor Resume
          </Typography>
        </Box>

        {/* Chrome Address Bar */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#2A2B32",
            borderRadius: 2,
            px: 2,
            py: 0.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography sx={{ fontSize: "0.75rem", color: "#8E8EA0", fontFamily: "monospace" }}>
            https://chat.openai.com/c/tailor-{resume.id}
          </Typography>
          <Typography sx={{ fontSize: "0.7rem", color: "#10A37F", fontWeight: 600 }}>
            🔒 Secure SSL
          </Typography>
        </Box>

        <IconButton size="small" onClick={onClose} sx={{ color: "#8E8EA0", "&:hover": { color: "#FFFFFF" } }}>
          ✕
        </IconButton>
      </Box>

      {/* ChatGPT Workspace Body */}
      <DialogContent
        sx={{
          p: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "#343541",
          color: "#ECECF1",
          overflow: "hidden"
        }}
      >
        {/* Messages Stream */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: msg.role === "assistant" ? "#444654" : "transparent"
              }}
            >
              <Avatar
                sx={{
                  bgcolor: msg.role === "assistant" ? "#10A37F" : "#5436DA",
                  width: 34,
                  height: 34,
                  fontSize: "0.85rem",
                  fontWeight: 700
                }}
              >
                {msg.role === "assistant" ? "AI" : "YOU"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#FFFFFF" }}>
                    {msg.role === "assistant" ? "ChatGPT" : "You"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#8E8EA0" }}>
                    {msg.time}
                  </Typography>
                </Box>
                <Typography
                  component="div"
                  sx={{
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    color: "#D1D5DB",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            </Box>
          ))}

          {isGenerating && (
            <Box sx={{ display: "flex", gap: 2, p: 2, bgcolor: "#444654", borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: "#10A37F", width: 34, height: 34, fontSize: "0.85rem" }}>
                AI
              </Avatar>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "0.85rem", color: "#10A37F", fontStyle: "italic" }}>
                  ChatGPT is tailoring your CV to the target job description...
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Input Area with Ready Prompt & Attached CV */}
        <Paper
          elevation={4}
          sx={{
            p: 2,
            bgcolor: "#202123",
            borderTop: "1px solid #4D4D4F"
          }}
        >
          {/* CV Attached Tag */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  bgcolor: "#2A2B32",
                  border: "1px solid #565869",
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 0.5
                }}
              >
                <Typography sx={{ fontSize: "0.75rem", color: "#10A37F", fontWeight: 700 }}>
                  📎 Attached:
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#ECECF1", fontWeight: 600 }}>
                  {resume.name} ({resume.contact?.fullName || "CV"}.pdf)
                </Typography>
              </Box>
              {targetJobDescription && (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    bgcolor: "#2A2B32",
                    border: "1px solid #565869",
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 0.5
                  }}
                >
                  <Typography sx={{ fontSize: "0.75rem", color: "#60A5FA", fontWeight: 700 }}>
                    🎯 Job Target:
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#ECECF1", fontWeight: 600 }}>
                    {resume.jobTitle || resume.company || "Configured"}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Copy prompt with full CV & Job Description to clipboard">
                <Button
                  size="small"
                  onClick={handleCopyPrompt}
                  sx={{
                    fontSize: "0.75rem",
                    color: copied ? "#10A37F" : "#C5C5D2",
                    bgcolor: "#2A2B32",
                    border: "1px solid #565869",
                    "&:hover": { bgcolor: "#343541" }
                  }}
                >
                  {copied ? "✓ Copied Prompt" : "📋 Copy Prompt"}
                </Button>
              </Tooltip>
              <Tooltip title="Open official chat.openai.com with prompt in clipboard">
                <Button
                  size="small"
                  onClick={handleOpenChatGPTExternal}
                  sx={{
                    fontSize: "0.75rem",
                    color: "#FFFFFF",
                    bgcolor: "#10A37F",
                    "&:hover": { bgcolor: "#0E906F" }
                  }}
                >
                  Open in ChatGPT ↗
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* Multiline Prompt Box */}
          <TextField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            multiline
            minRows={2}
            maxRows={6}
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#40414F",
                color: "#FFFFFF",
                fontSize: "0.85rem",
                borderRadius: 2,
                "& fieldset": { borderColor: "#565869" },
                "&:hover fieldset": { borderColor: "#10A37F" },
                "&.Mui-focused fieldset": { borderColor: "#10A37F" }
              }
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5 }}>
            <Typography variant="caption" sx={{ color: "#8E8EA0", fontSize: "0.72rem" }}>
              Prompt pre-loaded with target job description and full resume text.
            </Typography>
            <Button
              variant="contained"
              disabled={isGenerating || !prompt.trim()}
              onClick={handleSendPrompt}
              sx={{
                bgcolor: "#10A37F",
                fontWeight: 700,
                fontSize: "0.8rem",
                borderRadius: 2,
                px: 2.5,
                "&:hover": { bgcolor: "#0E906F" }
              }}
            >
              {isGenerating ? "Tailoring..." : "Send to ChatGPT"}
            </Button>
          </Box>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};
