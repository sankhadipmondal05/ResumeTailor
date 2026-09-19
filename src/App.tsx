import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme/theme";
import { ResumeProvider } from "./context/ResumeContext";
import { AppShell } from "./components/layout/AppShell";
import { Dashboard } from "./pages/Dashboard";
import { ResumeList } from "./pages/ResumeList";
import { ResumeEditorPage } from "./pages/ResumeEditorPage";
import { JobMatchPage } from "./pages/JobMatchPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AtsScorePage } from "./pages/AtsScorePage";

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResumeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Dashboard />} />
              <Route path="resumes" element={<ResumeList />} />
              <Route path="resumes/master" element={<ResumeEditorPage />} />
              <Route path="resumes/:id" element={<ResumeEditorPage />} />
              <Route path="ats-score" element={<AtsScorePage />} />
              <Route path="match" element={<JobMatchPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ResumeProvider>
    </ThemeProvider>
  );
};

export default App;
