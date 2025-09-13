import {
  Box,
  Typography,
  IconButton,
  Paper,
  useMediaQuery,
  Button,
} from "@mui/material";
import { DarkMode, LightMode, DeleteForever } from "@mui/icons-material";
import { motion } from "framer-motion";
import useCalculator from "../hooks/useCalculator";
import Display from "./Display";
import Keypad from "./Keypad";
import History from "./History";

export default function Calculator({ theme, darkMode, setDarkMode }) {
  const { input, setInput, history, handleClick, clearHistory } = useCalculator();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={12}
        sx={{
          width: "100%",
          maxWidth: isDesktop ? 900 : 400,
          margin: "auto",
          mt: { xs: 0, md: 4 },
          p: 2,
          borderRadius: 4,
          background: darkMode
            ? "rgba(30,30,30,0.9)"
            : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            ⚡ Calculadora Jorge Patricio Santamaría Cherrez
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        {/* Layout */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Display value={input} darkMode={darkMode} />
            <Keypad handleClick={handleClick} darkMode={darkMode} theme={theme} />
          </Box>

          {isDesktop && (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Historial
                </Typography>
                <Button
                  onClick={clearHistory}
                  size="small"
                  color="error"
                  startIcon={<DeleteForever />}
                >
                  Borrar
                </Button>
              </Box>
              <History history={history} darkMode={darkMode} setInput={setInput} />
            </Box>
          )}
        </Box>

        {!isDesktop && (
          <Box mt={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Historial
              </Typography>
              <Button
                onClick={clearHistory}
                size="small"
                color="error"
                startIcon={<DeleteForever />}
              >
                Borrar
              </Button>
            </Box>
            <History history={history} darkMode={darkMode} setInput={setInput} />
          </Box>
        )}
      </Paper>
    </motion.div>
  );
}
