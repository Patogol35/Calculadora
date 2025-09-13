import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { motion } from "framer-motion";
import * as math from "mathjs";
import Display from "./Display";
import Keypad from "./Keypad";
import History from "./History";

export default function Calculator({ theme, darkMode, setDarkMode }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  // ✅ cargar historial desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // ✅ guardar historial en localStorage
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

  // ✅ soporte teclado físico
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
          width: { xs: "100%", sm: 380 },
          maxWidth: "100%",
          p: 2,
          borderRadius: 4,
          background: darkMode
            ? "rgba(30,30,30,0.9)"
            : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            ⚡ Calculadora Pro
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        {/* Display */}
        <Display value={input} darkMode={darkMode} />

        {/* Teclado */}
        <Keypad handleClick={handleClick} darkMode={darkMode} theme={theme} />

        {/* Historial (colapsa en mobile) */}
        <History history={history} darkMode={darkMode} />
      </Paper>
    </motion.div>
  );
}
