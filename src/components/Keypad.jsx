import { Grid, Button, Collapse, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useState, memo } from "react";

const basicButtons = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
  ["(", ")", "^", "√"],
  ["AC", "DEL"],
];

const advancedButtons = [
  ["sin", "cos", "tan", "log"],
  ["π", "e", "ln", "!"],
];

const KeyButton = memo(({ btn, handleClick }) => {
  const getColor = (btn) => {
    if (btn === "=") return "primary";
    if (["/", "*", "-", "+", "^", "√"].includes(btn)) return "secondary";
    if (btn === "AC") return "error";
    if (btn === "DEL") return "warning";
    return "inherit";
  };

  return (
    <motion.div whileTap={{ scale: 0.85 }}>
      <Button
        fullWidth
        variant={btn === "=" ? "contained" : "outlined"}
        color={getColor(btn)}
        onClick={() => handleClick(btn)}
        sx={{
          height: 60,
          borderRadius: "16px",
          fontWeight: "bold",
          fontSize: "1.1rem",
          textTransform: "none",
        }}
      >
        {btn}
      </Button>
    </motion.div>
  );
});

export default function Keypad({ handleClick }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,        // 🔥 FIX real: keypad siempre del mismo tamaño
        mx: "auto",           // 🔥 Centrado siempre
      }}
    >
      {/* Grid de botones centrado */}
      <Grid
        container
        spacing={1}
        columns={4}            // 🔥 Fuerza siempre 4 columnas reales
      >
        {basicButtons.flat().map((btn, i) => (
          <Grid
            item
            xs={btn === "=" ? 2 : 1}   // 1 columna normal, "=" ocupa 2
            key={i}
          >
            <KeyButton btn={btn} handleClick={handleClick} />
          </Grid>
        ))}
      </Grid>

      {/* Botón más avanzado */}
      <Button
        fullWidth
        variant="text"
        sx={{ mt: 2 }}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? "Ocultar funciones avanzadas" : "Funciones avanzadas"}
      </Button>

      {/* Avanzados */}
      <Collapse in={showAdvanced} sx={{ mt: 1 }}>
        <Grid container spacing={1} columns={4}>
          {advancedButtons.flat().map((btn, i) => (
            <Grid item xs={1} key={i}>
              <KeyButton btn={btn} handleClick={handleClick} />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Box>
  );
}
