import { createTheme } from "@mui/material/styles";

// Color Theory Palette:
// Orange: Energy, Warmth, and Attention 
// Dark Brown: Trust, Stability, and Professionalism

const theme = createTheme({
  palette: {
    primary: {
      main: "#F59E0B", // Cinnamon Orange (Primary Color)
      contrastText: "#fff", // Contrast text color for buttons/labels
    },
    secondary: {
      main: "#3C2F2F", // Dark Brown (Secondary Color - Footer, Headings)
    },
    background: {
      default: "#FAFAFA", // Light grey background for readability
      paper: "#ffffff",
    },
    text: {
      primary: "#333333", // Dark grey for better legibility than pure black
      secondary: "#777777",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif", // Modern sans-serif look
    h4: {
      fontWeight: 700, // Strong headings for clear hierarchy
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      fontWeight: "bold",
      textTransform: "none", // Avoid all-caps buttons for a friendly UI
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Modern rounded corners
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px", // Soft edges for card components
        },
      },
    },
  },
});

export default theme;