import React from "react";
import {
  Box,
  Typography,
  Button
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  DescriptionIcon,
  AddIcon
} from "../icons/Icons";

interface TopbarProps {
  onTailorClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onTailorClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
    { label: "My Resumes", path: "/resumes", icon: <DescriptionIcon sx={{ fontSize: 18 }} /> },
    {
      label: "ATS Score",
      path: "/ats-score",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M19.07 4.93l-2.83 2.83M22 12h-4" />
          <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          <path d="m14 10-3 3" />
        </svg>
      )
    }
  ];

  return (
    <Box
      sx={{
        borderBottom: "1px solid #E4E6E8",
        bgcolor: "#FFFFFF",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%"
      }}
    >
      <Box
        sx={{
          height: 64,
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2.5, md: 4 },
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center"
        }}
      >
        {/* Left: Brand Name without 'R' icon */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            onClick={() => navigate("/")}
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#111111",
              fontSize: "1.15rem",
              cursor: "pointer",
              userSelect: "none",
              letterSpacing: "-0.02em"
            }}
          >
            ResumeTailor
          </Typography>
        </Box>

        {/* Center: Dashboard & My Resumes navigation */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Button
                  key={item.path}
                  size="small"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: isActive ? "#4F46E5" : "#5F6368",
                    bgcolor: isActive ? "#F0F2FF" : "transparent",
                    fontWeight: isActive ? 600 : 500,
                    px: 2,
                    py: 0.75,
                    borderRadius: 1.5,
                    fontSize: "0.875rem",
                    "&:hover": {
                      bgcolor: isActive ? "#F0F2FF" : "#F7F7F8",
                      color: isActive ? "#4F46E5" : "#111111"
                    }
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Right: Only "+ New Resume" */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          {onTailorClick && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={onTailorClick}
            >
              New Resume
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
