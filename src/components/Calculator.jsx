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
  const { input, setInput, history, handleClick, clearHistory } =
    useCalculator();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const historySection = (
    <Box>
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
  );

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
          maxWidth: 750,
          margin: "0 auto",
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
            Autor:Jorge Patricio Santamaría Cherrez
          </Typography>

          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            disableRipple
            sx={{
              "&:hover": { backgroundColor: "transparent" },
              transition: "color 0.3s ease",
            }}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        {/* Layout principal */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isDesktop ? "1.7fr 1fr" : "1fr",
            gap: 2,
          }}
        >
          {/* Calculadora */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Display value={input} darkMode={darkMode} />

            <Box sx={{ width: "100%", maxWidth: 350, mx: "auto" }}>
              <Keypad
                handleClick={handleClick}
                darkMode={darkMode}
                theme={theme}
              />
            </Box>
          </Box>

          {/* Historial Desktop */}
          {isDesktop && (
            <Paper
              elevation={6}
              sx={{
                p: 2,
                borderRadius: 3,
                maxHeight: 500,
                overflowY: "auto",
                bgcolor: darkMode
                  ? "rgba(20,20,20,0.8)"
                  : "rgba(245,245,245,0.9)",
              }}
            >
              {historySection}
            </Paper>
          )}
        </Box>

        {/* Historial móvil */}
        {!isDesktop && <Box mt={2}>{historySection}</Box>}
      </Paper>
    </motion.div>
  );
}
