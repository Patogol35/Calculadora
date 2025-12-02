import { useState, useEffect, useCallback } from "react";
import * as math from "mathjs";

// =======================
// FORMAT EXPRESSION
// =======================
function formatExpression(expr) {
  let formatted = expr.replace(/\s+/g, "").replace(/,/g, ".");

  // Reemplazar operadores dobles → solo dejar el último
  formatted = formatted.replace(/([+\-*/])([+\-*/])/g, (_, prev, curr) => curr);

  // Evitar más de un punto en el mismo número
  formatted = formatted.replace(/(\d*\.\d*)\./g, "$1");

  // Convertir (5)(3) → (5)*(3)
  formatted = formatted.replace(/\)\(/g, ")*(");

  // ================================
  // ✔️ Soporte para raíz cuadrada
  // ================================

  // √9 → sqrt(9)
  formatted = formatted.replace(/√(\d+(\.\d+)?)/g, "sqrt($1)");

  // √(3+5) → sqrt(3+5)
  formatted = formatted.replace(/√\(/g, "sqrt(");

  return formatted;
}

// =======================
// MAIN HOOK
// =======================
export default function useCalculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [lastWasResult, setLastWasResult] = useState(false);
  const [error, setError] = useState(false);

  // =======================
  // Cargar historial
  // =======================
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // =======================
  // Guardar historial
  // =======================
  useEffect(() => {
    localStorage.setItem("calc-history", JSON.stringify(history));
  }, [history]);

  // =======================
  // Calcular
  // =======================
  const calculate = useCallback(() => {
    try {
      const expr = formatExpression(input);
      if (!expr) return;

      const result = math.evaluate(expr).toString();

      setHistory((h) => [`${expr} = ${result}`, ...h].slice(0, 10));
      setInput(result);
      setLastWasResult(true);
      setError(false);
    } catch {
      setInput("Error");
      setError(true);
      setLastWasResult(false);
    }
  }, [input]);

  // =======================
  // APLICAR INPUT
  // =======================
  function applyInput(value) {
    // Si había error
    if (error) {
      setError(false);
      return setInput(isNaN(value) ? "" : value);
    }

    // No permitir iniciar con + * /
    if (input === "") {
      if (value === "-") return setInput("-");
      if ("+*/".includes(value)) return;
    }

    setInput((prev) => {
      if (lastWasResult) {
        setLastWasResult(false);

        if (!isNaN(value)) return value;

        return prev + value;
      }

      return formatExpression(prev + value);
    });
  }

  // =======================
  // Click en botones
  // =======================
  const handleClick = (value) => {
    switch (value) {
      case "=":
        return calculate();
      case "AC":
        setInput("");
        setError(false);
        setLastWasResult(false);
        return;
      case "DEL":
        return setInput((prev) => prev.slice(0, -1));
      default:
        return applyInput(value);
    }
  };

  // =======================
  // Teclado físico
  // =======================
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      const isValid =
        (key >= "0" && key <= "9") || "+-*/().√".includes(key);

      if (isValid) {
        return applyInput(key);
      }

      if (key === "Enter") {
        e.preventDefault();
        return calculate();
      }

      if (key === "Backspace") {
        return setInput((prev) => prev.slice(0, -1));
      }

      if (key === "Escape") {
        setInput("");
        setError(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculate, error, lastWasResult]);

  // =======================
  // Limpiar historial
  // =======================
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calc-history");
  };

  return {
    input,
    setInput,
    history,
    handleClick,
    clearHistory,
    error,
  };
        }
