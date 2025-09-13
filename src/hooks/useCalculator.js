import { useState, useEffect, useCallback } from "react";
import { evaluate, format } from "mathjs";

export default function useCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("calcHistory")) || [];
  });

  const formatExpression = useCallback((expr) => {
    let formatted = expr.replace(/√(\d+(\.\d+)?)/g, "sqrt($1)");
    while (formatted.includes("√(")) {
      formatted = formatted.replace(/√\(([^()]+)\)/g, "sqrt($1)");
    }
    return formatted;
  }, []);

  const calculateResult = useCallback(() => {
    try {
      const formattedExpression = formatExpression(expression);
      const evalResult = evaluate(formattedExpression);
      const formattedResult = format(evalResult, { precision: 12 });
      setResult(formattedResult);

      const newHistory = [
        { expr: expression, res: formattedResult },
        ...history,
      ].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem("calcHistory", JSON.stringify(newHistory));
    } catch {
      setResult("Error");
    }
  }, [expression, history, formatExpression]);

  const handleClick = (value) => {
    if (value === "C") {
      setExpression("");
      setResult("");
    } else if (value === "=") {
      calculateResult();
    } else {
      setExpression((prev) => prev + value);
    }
  };

  const handleKeyDown = useCallback(
    (event) => {
      const { key } = event;
      if ((/[0-9+\-*/().]/.test(key)) || key === "Enter" || key === "Backspace") {
        event.preventDefault();
        if (key === "Enter") calculateResult();
        else if (key === "Backspace") setExpression((prev) => prev.slice(0, -1));
        else setExpression((prev) => prev + key);
      }
    },
    [calculateResult]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { expression, result, history, handleClick, setExpression };
}
