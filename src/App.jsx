import { useState } from "react";
import { Box, CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import Calculator from "./components/Calculator";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: "#6C63FF" },
      secondary: { main: "#FF6584" },
    },
    typography: { fontFamily: "Poppins, sans-serif" },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
          background: darkMode
            ? "linear-gradient(135deg, #1f1c2c, #928dab)"
            : "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          p: 2,
        }}
      >
        <Calculator
          theme={theme}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </Box>
    </ThemeProvider>
  );
}
