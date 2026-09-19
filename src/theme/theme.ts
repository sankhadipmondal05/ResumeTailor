import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5",
      dark: "#4338CA",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#5F6368"
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#111111",
      secondary: "#5F6368"
    },
    divider: "#E4E6E8",
    success: {
      main: "#16803C"
    },
    warning: {
      main: "#A16207"
    },
    error: {
      main: "#B42318"
    }
  },
  typography: {
    fontFamily: '"Inter", "Arial", sans-serif',
    h1: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#111111"
    },
    h2: {
      fontSize: "1.375rem",
      fontWeight: 600,
      color: "#111111"
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "#111111"
    },
    h4: {
      fontSize: "1rem",
      fontWeight: 600,
      color: "#111111"
    },
    body1: {
      fontSize: "0.875rem",
      color: "#111111"
    },
    body2: {
      fontSize: "0.75rem",
      color: "#5F6368"
    },
    button: {
      textTransform: "none",
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          padding: "7px 16px",
          "&:hover": {
            boxShadow: "none"
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#E4E6E8"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B0B5BB"
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none"
        },
        rounded: {
          borderRadius: 10
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          border: "1px solid #E4E6E8",
          boxShadow: "none"
        }
      }
    }
  }
});
