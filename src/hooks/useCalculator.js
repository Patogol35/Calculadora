import { useState } from "react";
import { evaluate } from "mathjs";

export default function useCalculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState("deg"); // deg | rad

  // ---------------------------------------
  // Insertar texto en la expresión
  // ---------------------------------------
  const input = (value) => {
    setExpression((prev) => prev + value);
  };

  // ---------------------------------------
  // Borrar todo
  // ---------------------------------------
  const clear = () => {
    setExpression("");
    setResult("");
  };

  // ---------------------------------------
  // Borrar último carácter
  // ---------------------------------------
  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  // ---------------------------------------
  // Factorial (!)
  // ---------------------------------------
  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let f = 1;
    for (let i = 1; i <= n; i++) f *= i;
    return f;
  };

  // ---------------------------------------
  // Evaluar la expresión
  // ---------------------------------------
  const calculate = () => {
    try {
      let exp = expression;

      // Reemplazos para mathjs
      exp = exp.replace(/π/g, "pi");
      exp = exp.replace(/√/g, "sqrt");
      exp = exp.replace(/×/g, "*");
      exp = exp.replace(/÷/g, "/");

      // Manejo de factorial
      exp = exp.replace(/(\d+)!/g, "factorial($1)");

      // Función factorial para mathjs
      const scope = {
        factorial: factorial,
        deg: (x) => x * (Math.PI / 180),
      };

      // Transformar sin() / cos() / tan() según modo
      if (mode === "deg") {
        exp = exp.replace(/sin\(/g, "sin(deg(");
        exp = exp.replace(/cos\(/g, "cos(deg(");
        exp = exp.replace(/tan\(/g, "tan(deg(");
      }

      // Evaluar
      const evaluated = evaluate(exp, scope);

      setResult(evaluated.toString());

      // Guardar en historial
      const entry = {
        exp: expression,
        res: evaluated.toString(),
        id: Date.now(),
      };
      setHistory((prev) => [entry, ...prev]);

    } catch (err) {
      setResult("Error");
    }
  };

  // ---------------------------------------
  // Cambiar entre grados y radianes
  // ---------------------------------------
  const toggleMode = () => {
    setMode((m) => (m === "deg" ? "rad" : "deg"));
  };

  return {
    expression,
    result,
    history,
    mode,
    input,
    clear,
    backspace,
    calculate,
    toggleMode,
  };
}
