import { Grid, Button, Collapse } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

const basicButtons = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
  ["(", ")", "^", "√"],
  ["%", "AC", "DEL"],
];

const advancedButtons = [
  ["sin", "cos", "tan", "log"],
  ["π", "e", "ln", "!"],
];

export default function Keypad({ handleClick }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const getColor = (btn) => {
    if (btn === "=") return "primary";
    if (["/", "*", "-", "+", "^", "√", "%"].includes(btn)) return "secondary";
    if (btn === "AC") return "error";
    if (btn === "DEL") return "warning";
    return "inherit";
  };

  return (
    <>
      <Grid container spacing={1}>
        {basicButtons.flat().map((btn, i) => (
          <Grid item xs={btn === "=" ? 6 : 3} key={i}>
            <motion.div whileTap={{ scale: 0.85 }}>
              <Button
                fullWidth
                variant={btn === "=" ? "contained" : "outlined"}
                color={getColor(btn)}
                onClick={() => handleClick(btn)}
                sx={{
                  height: { xs: 60, sm: 70 },
                  borderRadius: "16px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  textTransform: "none",
                }}
              >
                {btn}
              </Button>
            </motion.div>
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
              <motion.div whileTap={{ scale: 0.85 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleClick(btn)}
                  sx={{
                    height: { xs: 60, sm: 70 },
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    textTransform: "none",
                  }}
                >
                  {btn}
                </Button>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </>
  );
}
