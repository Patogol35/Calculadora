import { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Switch,
  CssBaseline,
  Box,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useCalculator from "./hooks/useCalculator";
import { buttons } from "./utils/buttonsConfig";
import CalcButton from "./components/CalcButton";
import Display from "./components/Display";
import History from "./components/History";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { expression, result, history, handleClick, setExpression } =
    useCalculator();

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xs" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Calculadora Científica
        </Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <Typography>🌞</Typography>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <Typography>🌙</Typography>
        </Box>
        <Display expression={expression} result={result} />
        <Grid container spacing={1}>
          {buttons.flat().map((btn, i) => (
            <Grid item xs={3} key={i}>
              <CalcButton value={btn} onClick={handleClick} />
            </Grid>
          ))}
        </Grid>
        <Box mt={3}>
          <History history={history} onSelect={setExpression} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
