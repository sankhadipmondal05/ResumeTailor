import React, { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { TailorModal } from "../common/TailorModal";

export const AppShell: React.FC = () => {
  const [tailorOpen, setTailorOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", bgcolor: "#FFFFFF" }}>
      <Topbar onTailorClick={() => setTailorOpen(true)} />
      <Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
        <Outlet />
      </Box>
      <TailorModal open={tailorOpen} onClose={() => setTailorOpen(false)} />
    </Box>
  );
};
