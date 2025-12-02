import { useState, useEffect, useCallback, useRef } from "react";
import * as math from "mathjs";

// === Throttle util ===
function useThrottle(fn, delay) {
  const lastCall = useRef(0);
  return (...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      fn(...args);
    }
  };
}

// === Expression Formatter corregido ===
// Permite escribir + y - normalmente.
// Reemplaza un operador por otro en vez de borrar todo.
function formatExpression(expr) {
  let formatted = expr;

  // Quitar espacios
  formatted = formatted.replace(/\s+/g, "");

  // Reemplazar comas por puntos
  formatted = formatted.replace(/,/g, ".");

  // Evitar operadores dobles, pero permitimos reemplazar el anterior.
  // Ej: 5+- → 5-
  formatted = formatted.replace(/([+\-*/])([+\-*/])/g, (_, prev, curr) => curr);

  // Evitar múltiples puntos en un número
  formatted = formatted.replace(/(\d*\.\d*)\./g, "$1");

  // Convertir (5)(3) en (5)*(3)
  formatted = formatted.replace(/\)\(/g, ")*(");

  return formatted;
}

// === Main Hook ===
export default function useCalculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [lastWasResult, setLastWasResult] = useState(false);
  const [error, setError] = useState(false);

  // === Cargar historial ===
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // === Guardar historial con throttle ===
  const saveHistory = useThrottle((newHistory) => {
    localStorage.setItem("calc-history", JSON.stringify(newHistory));
  }, 300);

  useEffect(() => {
    saveHistory(history);
  }, [history, saveHistory]);

  // === Calcular resultado ===
  const calculate = useCallback(() => {
    try {
      setError(false);

      const expr = formatExpression(input);
      if (!expr) return;

      const result = math.evaluate(expr).toString();

      setHistory([`${expr} = ${result}`, ...history.slice(0, 9)]);
      setInput(result);
      setLastWasResult(true);
    } catch {
      setInput("Error");
      setError(true);
      setLastWasResult(false);
    }
  }, [input, history]);

  // === Click en botones ===
  const handleClick = (value) => {
    if (error) {
      if (!isNaN(value)) {
        setError(false);
        setInput(value);
      } else {
        setError(false);
        setInput("");
      }
      return;
    }

    switch (value) {
      case "=":
        calculate();
        break;

      case "AC":
        setInput("");
        setError(false);
        setLastWasResult(false);
        break;

      case "DEL":
        if (error) {
          setError(false);
          setInput("");
        } else {
          setInput((prev) => prev.slice(0, -1));
        }
        break;

      default:
        setInput((prev) => {
          let next;

          // Si el último fue resultado
          if (lastWasResult) {
            setLastWasResult(false);

            // Si es número, reemplazar
            if (!isNaN(value)) {
              return value;
            }

            // Si es operador, continuar expresion
            return prev + value;
          }

          next = prev + value;

          return formatExpression(next);
        });
    }
  };

  // === Limpiar historial ===
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calc-history");
  };

  // === Teclado físico ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (error) {
        if (key >= "0" && key <= "9") {
          setError(false);
          setInput(key);
        } else {
          setError(false);
          setInput("");
        }
        return;
      }

      if ((key >= "0" && key <= "9") || "+-*/().".includes(key)) {
        setInput((prev) => {
          let next;

          if (lastWasResult && key >= "0" && key <= "9") {
            setLastWasResult(false);
            next = key;
          } else if (lastWasResult && "+-*/".includes(key)) {
            setLastWasResult(false);
            next = prev + key;
          } else {
            next = prev + key;
          }

          return formatExpression(next);
        });
      } else if (key === "Enter") {
        e.preventDefault();
        calculate();
      } else if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      } else if (key === "Escape") {
        setInput("");
        setError(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculate, error, lastWasResult]);

  return {
    input,
    setInput,
    history,
    handleClick,
    clearHistory,
    error,
  };
}
