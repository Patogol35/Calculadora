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
  const [error, setError] = useState(false);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem("calc-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history with throttle
  const saveHistory = useThrottle((newHistory) => {
    localStorage.setItem("calc-history", JSON.stringify(newHistory));
  }, 300);

  useEffect(() => {
    saveHistory(history);
  }, [history, saveHistory]);

  // Main calculation
  const calculate = useCallback(() => {
    try {
      setError(false);

      const expr = formatExpression(input);
      const result = math.evaluate(expr).toString();

      setHistory([`${input} = ${result}`, ...history.slice(0, 9)]);
      setInput(result);
      setLastWasResult(true);
    } catch (err) {
      setInput("Error");
      setError(true);
      setLastWasResult(false);
    }
  }, [input, history]);

  // Handle button clicks
  const handleClick = (value) => {
    // Caso 1: Hay error y presiona un número → reiniciar
    if (error && !isNaN(value)) {
      setError(false);
      setInput(value);
      return;
    }

    // Caso 2: Hay error y presiona símbolo → limpiar antes
    if (error) {
      setError(false);
      setInput("");
    }

    if (value === "=") {
      calculate();
    } else if (value === "AC") {
      setInput("");
      setError(false);
      setLastWasResult(false);
    } else if (value === "DEL") {
      setInput((prev) => prev.slice(0, -1));
    } else {
      setInput((prev) => {
        // Si el último fue resultado y ahora presiona número → reemplazar
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

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      // Si hay error y presiona número
      if (error && key >= "0" && key <= "9") {
        setError(false);
        setInput(key);
        return;
      }

      // Si hay error y presiona otra cosa
      if (error) {
        setError(false);
        setInput("");
      }

      if ((key >= "0" && key <= "9") || "+-*/().".includes(key)) {
        setInput((prev) => {
          if (lastWasResult && key >= "0" && key <= "9") {
            setLastWasResult(false);
            return key;
          } else if (lastWasResult && "+-*/".includes(key)) {
            setLastWasResult(false);
            return prev + key;
          }
          setLastWasResult(false);
          return prev + key;
        });
      } else if (key === "Enter") {
        calculate();
      } else if (key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
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
    error, // <-- lo envías al componente principal por si quieres mostrar un Alert
  };
}
