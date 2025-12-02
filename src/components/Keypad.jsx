import { Grid, Button, Collapse } from "@mui/material";
import { motion } from "framer-motion";
import { useState, memo, useCallback } from "react";

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

const getColor = (btn) => {
  if (btn === "=") return "primary";
  if (["/", "*", "-", "+", "^", "√"].includes(btn)) return "secondary";
  if (btn === "AC") return "error";
  if (btn === "DEL") return "warning";
  return "inherit";
};

const KeyButton = memo(({ btn, handleClick }) => (
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
));

export default function Keypad({ handleClick }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const renderRows = useCallback(
    (rows, isAdvanced = false) =>
      rows.map((row, rowIndex) => (
        <Grid
          container
          spacing={1}
          key={rowIndex}
          sx={{ mb: 1 }}
          justifyContent="center"
        >
          {row.map((btn, i) => {
            const xs =
              isAdvanced ? 3 : btn === "=" ? 6 : row.length === 2 ? 6 : 3;

            return (
              <Grid item xs={xs} key={i}>
                <KeyButton btn={btn} handleClick={handleClick} />
              </Grid>
            );
          })}
        </Grid>
      )),
    [handleClick]
  );

  return (
    <>
      {renderRows(basicButtons)}

      <Button
        fullWidth
        variant="text"
        sx={{ mt: 1 }}
        onClick={() => setShowAdvanced((prev) => !prev)}
      >
        {showAdvanced ? "Ocultar funciones avanzadas" : "Funciones avanzadas"}
      </Button>

      <Collapse in={showAdvanced} sx={{ mt: 1 }}>
        {renderRows(advancedButtons, true)}
      </Collapse>
    </>
  );
}
