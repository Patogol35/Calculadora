import { useState, useEffect, useCallback, useRef } from "react";
import * as math from "mathjs";
import { formatExpression } from "../utils/formatExpression";

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

export default function useCalculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [lastWasResult, setLastWasResult] = useState(false);

  // cargar historial
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // guardar historial (optimizado con throttle 300ms)
  const saveHistory = useThrottle((newHistory) => {
    localStorage.setItem("calc-history", JSON.stringify(newHistory));
  }, 300);

  useEffect(() => {
    saveHistory(history);
  }, [history, saveHistory]);

  const calculate = useCallback(() => {
    try {
      const expr = formatExpression(input);
      const result = math.evaluate(expr).toString();
      setHistory([`${input} = ${result}`, ...history.slice(0, 9)]);
      setInput(result);
      setLastWasResult(true);
    } catch (err) {
      setInput("Error"); // ❌ ahora no se borra solo
      setLastWasResult(false);
    }
  }, [input, history]);

  const handleClick = (value) => {
    if (value === "=") {
      calculate();
    } else if (value === "AC") {
      setInput("");
      setLastWasResult(false);
    } else if (value === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => {
        if (lastWasResult) {
          if (!isNaN(value)) {
            setLastWasResult(false);
            return value;
          } else {
            setLastWasResult(false);
            return prev + value;
          }
        }
        return prev + value;
      });
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
        setInput((prev) => {
          if (lastWasResult && e.key >= "0" && e.key <= "9") {
            setLastWasResult(false);
            return e.key;
          } else if (lastWasResult && "+-*/".includes(e.key)) {
            setLastWasResult(false);
            return prev + e.key;
          }
          setLastWasResult(false);
          return prev + e.key;
        });
      } else if (e.key === "Enter") {
        calculate();
      } else if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculate, lastWasResult]);

  return { input, setInput, history, handleClick, clearHistory };
}
