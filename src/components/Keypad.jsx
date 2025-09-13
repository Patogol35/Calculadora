import { Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";
const buttons = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
  ["(", ")", "^", "√"],
  ["sin", "cos", "tan", "log"],
  ["π", "e", "AC", "DEL"],
];
export default function Keypad({ handleClick, darkMode, theme }) {
  return (
    <Grid container spacing={1}>
      {buttons.flat().map((btn, i) => (
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
                bgcolor: btn === "=" ? theme.palette.primary.main : "transparent",
                color: btn === "=" ? "#fff" : theme.palette.text.primary,
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
  );
}