import { Grid, Paper, Collapse, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

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

export default function Keypad({ handleClick, darkMode, theme }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      <Grid container spacing={1}>
        {basicButtons.flat().map((btn, i) => (
          <Grid
            item
            xs={btn === "=" ? 6 : 3} // ✅ "=" ocupa doble ancho
            key={i}
          >
            <motion.div whileTap={{ scale: 0.9 }}>
              <Paper
                onClick={() => handleClick(btn)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: { xs: 55, sm: 60 },
                  borderRadius: 3,
                  cursor: "pointer",
                  fontWeight: "bold",
                  bgcolor:
                    btn === "=" ? theme.palette.primary.main : "transparent",
                  color:
                    btn === "=" ? "#fff" : theme.palette.text.primary,
                  "&:hover": {
                    bgcolor:
                      btn === "="
                        ? theme.palette.primary.dark
                        : darkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                  },
                }}
              >
                {btn}
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Botón para mostrar funciones avanzadas */}
      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? "Ocultar funciones avanzadas" : "Mostrar funciones avanzadas"}
      </Button>

      {/* Collapse para mostrar/ocultar */}
      <Collapse in={showAdvanced} sx={{ mt: 2 }}>
        <Grid container spacing={1}>
          {advancedButtons.flat().map((btn, i) => (
            <Grid item xs={3} key={i}>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Paper
                  onClick={() => handleClick(btn)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: { xs: 55, sm: 60 },
                    borderRadius: 3,
                    cursor: "pointer",
                    fontWeight: "bold",
                    bgcolor: "transparent",
                    color: theme.palette.text.primary,
                    "&:hover": {
                      bgcolor: darkMode
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  {btn}
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Collapse>
    </>
  );
}
