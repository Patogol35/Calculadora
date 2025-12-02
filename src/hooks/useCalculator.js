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

// === Expression Formatter ===
// Limpia expresiones para evitar errores en math.evaluate
function formatExpression(expr) {
  let formatted = expr;

  // Elimina espacios
  formatted = formatted.replace(/\s+/g, "");

  // Reemplaza comas por puntos
  formatted = formatted.replace(/,/g, ".");

  // Quita operadores duplicados tipo ++, --, **, //, +-, etc.
  formatted = formatted.replace(/([+\-*/]){2,}/g, (m) => m.slice(-1));

  // Quita punto decimal duplicado en un mismo número
  formatted = formatted.replace(/(\.\d*)\./g, "$1");

  // Corrige casos como (5)(3) → (5)*(3)
  formatted = formatted.replace(/\)\(/g, ")*(");

  // Evita expresiones que terminen con operador
  formatted = formatted.replace(/[+\-*/.]$/, "");

  // Evita expresiones que empiecen con operador no válido
  formatted = formatted.replace(/^([*/.]+)/, "");

  return formatted;
}

// === Main Hook ===
export default function useCalculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [lastWasResult, setLastWasResult] = useState(false);
  const [error, setError] = useState(false);

  // === Load history ===
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // === Save history with throttle ===
  const saveHistory = useThrottle((newHistory) => {
    localStorage.setItem("calc-history", JSON.stringify(newHistory));
  }, 300);

  useEffect(() => {
    saveHistory(history);
  }, [history, saveHistory]);

  // === Main calculation ===
  const calculate = useCallback(() => {
    try {
      setError(false);
      const expr = formatExpression(input);
      if (!expr) return;

      const result = math.evaluate(expr).toString();

      setHistory([`${expr} = ${result}`, ...history.slice(0, 9)]);
      setInput(result);
      setLastWasResult(true);
    } catch (err) {
      setInput("Error");
      setError(true);
      setLastWasResult(false);
    }
  }, [input, history]);

  // === Handle button clicks ===
  const handleClick = (value) => {
    if (error) {
      // Si hay error y presiona número → reinicia
      if (!isNaN(value)) {
        setError(false);
        setInput(value);
      } else if (value === "AC") {
        setError(false);
        setInput("");
      } else {
        // Cualquier otro valor borra el error
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
          // Si el último fue resultado y ahora presiona número → reemplaza
          if (lastWasResult) {
            setLastWasResult(false);
            return !isNaN(value) ? value : prev + value;
          }

          const next = prev + value;
          return formatExpression(next);
        });
    }
  };

  // === Clear history ===
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calc-history");
  };

  // === Keyboard input ===
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
            next = key;
          } else if (lastWasResult && "+-*/".includes(key)) {
            next = prev + key;
          } else {
            next = prev + key;
          }
          setLastWasResult(false);
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
