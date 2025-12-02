import { useState, useEffect, useCallback } from "react";
import * as math from "mathjs";

// =======================
// FORMAT EXPRESSION
// =======================
function formatExpression(expr) {
  let formatted = expr.replace(/\s+/g, "").replace(/,/g, ".");

  // Reemplazar operadores dobles → solo dejar el último
  formatted = formatted.replace(/([+\-*/])([+\-*/])/g, (m, prev, curr) => {
    if ((prev === "*" || prev === "/") && curr === "-") return prev + curr;
    return curr;
  });

  // Evitar ".."
  formatted = formatted.replace(/(\d*\.\d*)\./g, "$1");

  // (5)(3) → (5)*(3)
  formatted = formatted.replace(/\)\(/g, ")*(");

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
  // Historial
  // =======================
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("calc-history", JSON.stringify(history));
  }, [history]);

  // =======================
  // Calcular
  // =======================
  const calculate = useCallback(() => {
    try {
      const expr = formatExpression(input);

      const mathExpr = expr
        .replace(/√(\d+(\.\d+)?)/g, "sqrt($1)")
        .replace(/√\(/g, "sqrt(");

      const result = math.evaluate(mathExpr).toString();

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
  const applyInput = (value) => {
    if (error) {
      setError(false);
      return setInput(/^\d$/.test(value) ? value : "");
    }

    // No permitir iniciar con + * /
    if (!input && "+*/".includes(value)) return;

    setInput((prev) => {
      if (lastWasResult) {
        setLastWasResult(false);
        return isNaN(value) ? prev + value : value;
      }
      return formatExpression(prev + value);
    });
  };

  // =======================
  // Click botones
  // =======================
  const handleClick = (value) => {
    if (value === "=") return calculate();
    if (value === "AC") {
      setInput("");
      setError(false);
      setLastWasResult(false);
      return;
    }
    if (value === "DEL") return setInput((p) => p.slice(0, -1));

    applyInput(value);
  };

  // =======================
  // Teclado físico
  // =======================
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (/^[0-9]$/.test(key) || "+-*/().√".includes(key))
        return applyInput(key);

      if (key === "Enter") {
        e.preventDefault();
        return calculate();
      }

      if (key === "Backspace") return setInput((p) => p.slice(0, -1));

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
