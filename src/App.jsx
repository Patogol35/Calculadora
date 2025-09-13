import { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, IconButton, Box } from "@mui/material";
import Calculator from "./Calculator";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: { mode: darkMode ? "dark" : "light" },
    typography: {
      fontFamily: "'Poppins', sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: darkMode
            ? "linear-gradient(135deg,#0f2027,#203a43,#2c5364)"
            : "linear-gradient(135deg,#ece9e6,#ffffff)",
          p: 2,
        }}
      >
        <IconButton
          onClick={() => setDarkMode(!darkMode)}
          sx={{ position: "absolute", top: 20, right: 20 }}
          color="inherit"
        >
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <Calculator darkMode={darkMode} />
      </Box>
    </ThemeProvider>
  );
}
