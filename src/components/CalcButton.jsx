import { Button } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

function CalcButton({ value, onClick, className = "" }) {
  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Button
        variant="contained"
        fullWidth
        onClick={() => onClick(value)}
        className={className}
        sx={{
          fontSize: "1.2rem",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: 2,
          height: "60px",
        }}
      >
        {value}
      </Button>
    </motion.div>
  );
}

export default React.memo(CalcButton);
