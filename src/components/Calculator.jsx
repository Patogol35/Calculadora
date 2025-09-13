import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { motion } from "framer-motion";
import * as math from "mathjs";
import Display from "./Display";
import Keypad from "./Keypad";
import History from "./History";
export default function Calculator({ theme, darkMode, setDarkMode }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const handleClick = (value) => {
    if (value === "=") {
      try {
        let expr = input.replace("√", "sqrt").replace("π", "pi");
        const result = math.evaluate(expr).toString();
        setHistory([`${input} = ${result}`, ...history]); // guardar en historial
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={10}
        sx={{
          width: { xs: "95vw", sm: 360 },
          p: 3,
          borderRadius: 4,
          background: darkMode
            ? "rgba(40,40,40,0.85)"
            : "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
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
        {/* Historial */}
        <History history={history} darkMode={darkMode} />
        {/* Display */}
        <Display value={input} darkMode={darkMode} />
        {/* Keypad */}
        <Keypad
          handleClick={handleClick}
          darkMode={darkMode}
          theme={theme}
        />
      </Paper>
    </motion.div>
  );
}