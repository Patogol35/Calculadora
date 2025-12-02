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
          height: 65,
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
        maxWidth: 360,          // 🔥 TAMAÑO FIJO = NO SE DESORDENA
        mx: "auto",             // 🔥 SIEMPRE CENTRADO
      }}
    >
      <Grid container spacing={1}>
        {basicButtons.flat().map((btn, i) => (
          <Grid item xs={3} key={i}>
            <KeyButton btn={btn} handleClick={handleClick} />
          </Grid>
        ))}
      </Grid>

      <Button
        fullWidth
        variant="text"
        sx={{ mt: 2 }}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? "Ocultar funciones avanzadas" : "Funciones avanzadas"}
      </Button>

      <Collapse in={showAdvanced} sx={{ mt: 1 }}>
        <Grid container spacing={1}>
          {advancedButtons.flat().map((btn, i) => (
            <Grid item xs={3} key={i}>
              <KeyButton btn={btn} handleClick={handleClick} />
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </Box>
  );
}
