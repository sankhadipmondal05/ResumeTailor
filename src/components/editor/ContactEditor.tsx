import React from "react";
import { TextField, Grid, Typography, Card, CardContent } from "@mui/material";
import { Contact } from "../../types/resume";

interface ContactEditorProps {
  contact: Contact;
  onChange: (updated: Contact) => void;
}

export const ContactEditor: React.FC<ContactEditorProps> = ({ contact, onChange }) => {
  const handleChange = (field: keyof Contact, value: string) => {
    onChange({ ...contact, [field]: value });
  };

  return (
    <Card id="section-contact" sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ mb: 2, fontSize: "1.1rem", fontWeight: 700 }}>
          Contact Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              value={contact.fullName || ""}
              onChange={(e) => handleChange("fullName", e.target.value)}
              fullWidth
              size="small"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Professional Title"
              value={contact.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              fullWidth
              size="small"
              placeholder="e.g. Senior Software Engineer"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email Address"
              type="email"
              value={contact.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              value={contact.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              value={contact.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              fullWidth
              size="small"
              placeholder="e.g. San Francisco, CA"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="LinkedIn URL"
              value={contact.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              fullWidth
              size="small"
              placeholder="linkedin.com/in/username"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="GitHub URL"
              value={contact.github || ""}
              onChange={(e) => handleChange("github", e.target.value)}
              fullWidth
              size="small"
              placeholder="github.com/username"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Portfolio / Website"
              value={contact.portfolio || ""}
              onChange={(e) => handleChange("portfolio", e.target.value)}
              fullWidth
              size="small"
              placeholder="portfolio.dev"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
