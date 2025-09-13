import { useState, useEffect, useCallback } from "react";
import * as math from "mathjs";
import { formatExpression } from "../utils/formatExpression";

export default function useCalculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  // cargar historial
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // guardar historial
  useEffect(() => {
    localStorage.setItem("calc-history", JSON.stringify(history));
  }, [history]);

  const calculate = useCallback(() => {
    try {
      const expr = formatExpression(input);
      const result = math.evaluate(expr).toString();
      setHistory([`${input} = ${result}`, ...history.slice(0, 9)]);
      setInput(result);
    } catch (err) {
      setInput("Error");
      setTimeout(() => setInput(""), 1500);
    }
  }, [input, history]);

  const handleClick = (value) => {
    if (value === "=") {
      calculate();
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

  // teclado físico
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key >= "0" && e.key <= "9") || "+-*/().".includes(e.key)) {
        setInput((prev) => prev + e.key);
      } else if (e.key === "Enter") {
        calculate();
      } else if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculate]);

  return { input, setInput, history, handleClick, clearHistory };
}
