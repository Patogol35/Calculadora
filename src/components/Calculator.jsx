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

  // --- función que convierte expresiones con "√" a sqrt(...) manejando varios casos ---
  const formatExpression = (raw) => {
    if (!raw) return "";
    // quitar espacios y normalizar pi
    let s = raw.replace(/\s+/g, "");
    s = s.replace(/π/g, "pi");

    // transformaciones repetidas hasta no quedar '√' (maneja anidado)
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

          // caso: √( ... ) -> copiar contenido de paréntesis completo
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

          // caso: √sin(9) ó √cos( ... ) (nombre de función)
          if (/[a-zA-Z]/.test(s[i])) {
            let name = "";
            while (i < n && /[a-zA-Z]/.test(s[i])) {
              name += s[i];
              i++;
            }
            // si viene función con paréntesis, copiar hasta cerrar
            if (i < n && s[i] === "(") {
              out += name + "(";
              i++; // saltar '('
              let bal = 1;
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
            } else {
              // nombre simple (ej: pi o e)
              out += name + ")";
              continue;
            }
          }

          // caso: número (posible decimal)
          let token = "";
          while (i < n && /[0-9.]/.test(s[i])) {
            token += s[i];
            i++;
          }
          if (token.length) {
            out += token + ")";
            continue;
          }

          // fallback: cerrar si no se pudo identificar
          out += ")";
        } else {
          out += ch;
          i++;
        }
      }
      s = out;
    }

    // insertar multiplicación implícita antes de sqrt si hace falta (ej 2sqrt(...) => 2*sqrt(...))
    s = s.replace(/([0-9a-zA-Z\)])(?=sqrt\()/g, "$1*");

    return s;
  };

  const handleClick = (value) => {
    if (value === "=") {
      try {
        const expr = formatExpression(input); // aquí convertimos √ correctamente
        // console.log("expr para evaluar:", expr);
        const result = math.evaluate(expr).toString();
        setHistory([`${input} = ${result}`, ...history]);
        setInput(result);
      } catch (err) {
        console.error("Error evaluating:", err);
        setInput("Error");
        // opcional: limpiar después de 1.5s
        setTimeout(() => setInput(""), 1500);
      }
    } else if (value === "AC") {
      setInput("");
    } else if (value === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => prev + value);
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
  }, [input, history]);

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
