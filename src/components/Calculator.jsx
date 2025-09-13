import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  useMediaQuery,
  Button,
  Snackbar,
  Alert,
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
  const [error, setError] = useState("");
  const [animateResult, setAnimateResult] = useState(false);
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

  const formatExpression = (raw) => {
    if (!raw) return "";
    let s = raw.replace(/\s+/g, "").replace(/π/g, "pi");
    s = s.replace(/%/g, "/100"); // porcentaje
    let prev = null;
    while (s.includes("√") && s !== prev) {
      prev = s;
      let out = "";
      let i = 0;
      const n = s.length;
      while (i < n) {
        const ch = s[i];
        if (ch === "√") {
          out += "sqrt(";
          i++;
          if (i >= n) {
            out += ")";
            break;
          }
          if (s[i] === "(") {
            let bal = 0;
            while (i < n) {
              out += s[i];
              if (s[i] === "(") bal++;
              else if (s[i] === ")") {
                bal--;
                if (bal === 0) {
                  i++;
                  break;
                }
              }
              i++;
            }
            out += ")";
            continue;
          }
          let token = "";
          while (i < n && /[0-9.]/.test(s[i])) {
            token += s[i];
            i++;
          }
          if (token.length) {
            out += token + ")";
            continue;
          }
          out += ")";
        } else {
          out += ch;
          i++;
        }
      }
      s = out;
    }
    s = s.replace(/([0-9a-zA-Z\)])(?=sqrt\()/g, "$1*");
    return s;
  };

  const handleClick = (value) => {
    if (value === "=") {
      try {
        const expr = formatExpression(input);
        const result = math.evaluate(expr).toString();
        setHistory([`${input} = ${result}`, ...history]);
        setInput(result);
        setAnimateResult(true);
        setTimeout(() => setAnimateResult(false), 400);
      } catch (err) {
        setError("Expresión inválida");
        setInput("");
      }
    } else if (value === "AC") {
      setInput("");
    } else if (value === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + value);
    }
  };

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
  }, [input, history]);

  return (
    <>
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

          <Box
            sx={{
              display: "flex",
              flexDirection: isDesktop ? "row" : "column",
              gap: 2,
            }}
          >
            <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
              <Display
                value={input}
                darkMode={darkMode}
                animateResult={animateResult}
              />
              <Keypad handleClick={handleClick} />
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
                <History
                  history={history}
                  darkMode={darkMode}
                  onSelect={(item) => setInput(item.split("=")[0].trim())}
                />
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
              <History
                history={history}
                darkMode={darkMode}
                onSelect={(item) => setInput(item.split("=")[0].trim())}
              />
            </Box>
          )}
        </Paper>
      </motion.div>

      {/* Snackbar de error */}
      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
  }
