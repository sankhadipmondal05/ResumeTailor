import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  DescriptionIcon,
  SettingsIcon
} from "../icons/Icons";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/", icon: <DashboardIcon fontSize="small" /> },
    { label: "My Resumes", path: "/resumes", icon: <DescriptionIcon fontSize="small" /> }
  ];

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #E4E6E8",
        bgcolor: "#FFFFFF",
        position: "sticky",
        top: 0
      }}
    >
      {/* Brand */}
      <Box sx={{ height: 64, px: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "6px",
            bgcolor: "#4F46E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "1rem"
          }}
        >
          R
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#111111", fontSize: "1.1rem" }}>
          ResumeTailor
        </Typography>
      </Box>

      <Divider />

      {/* Main Nav */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  bgcolor: isActive ? "#F0F2FF" : "transparent",
                  color: isActive ? "#4F46E5" : "#5F6368",
                  "&:hover": {
                    bgcolor: isActive ? "#F0F2FF" : "#F7F7F8"
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 32,
                    color: isActive ? "#4F46E5" : "#5F6368"
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Bottom Nav */}
      <List sx={{ px: 1.5, py: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/settings")}
            sx={{
              borderRadius: 1,
              bgcolor: location.pathname === "/settings" ? "#F0F2FF" : "transparent",
              color: location.pathname === "/settings" ? "#4F46E5" : "#5F6368",
              "&:hover": {
                bgcolor: location.pathname === "/settings" ? "#F0F2FF" : "#F7F7F8"
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: location.pathname === "/settings" ? "#4F46E5" : "#5F6368"
              }}
            >
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: location.pathname === "/settings" ? 600 : 500
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};
