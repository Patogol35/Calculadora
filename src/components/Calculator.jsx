import { useState, useEffect } from "react";
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
import * as math from "mathjs";
import Display from "./Display";
import Keypad from "./Keypad";
import History from "./History";

export default function Calculator({ theme, darkMode, setDarkMode }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // cargar historial
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // guardar historial
  useEffect(() => {
    localStorage.setItem("calc-history", JSON.stringify(history));
  }, [history]);

  const handleClick = (value) => {
    if (value === "=") {
      try {
        let expr = input.replace("√", "sqrt").replace("π", "pi");
        const result = math.evaluate(expr).toString();
        setHistory([`${input} = ${result}`, ...history]);
        setInput(result);
      } catch {
        setInput("Error");
      }
    } else if (value === "AC") {
      setInput("");
    } else if (value === "DEL") {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  // borrar historial
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calc-history");
  };

  // soporte teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key >= "0" && e.key <= "9") || "+-*/().".includes(e.key)) {
        setInput((prev) => prev + e.key);
      } else if (e.key === "Enter") {
        handleClick("=");
      } else if (e.key === "Backspace") {
        handleClick("DEL");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

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
          mt: { xs: 0, md: 4 }, // 👈 en desktop queda con un margen top
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
            ⚡ Calculadora Pro
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        {/* Layout adaptativo */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            gap: 2,
          }}
        >
          {/* Izquierda */}
          <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Display value={input} darkMode={darkMode} />
            <Keypad handleClick={handleClick} darkMode={darkMode} theme={theme} />
          </Box>

          {/* Derecha (historial en desktop) */}
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
              <History history={history} darkMode={darkMode} />
            </Box>
          )}
        </Box>

        {/* Historial en mobile */}
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
            <History history={history} darkMode={darkMode} />
          </Box>
        )}
      </Paper>
    </motion.div>
  );
}
