import { motion } from "framer-motion";
import { Button } from "@mui/material";

export default function CalcButton({ value, onClick }) {
  return (
    <motion.div whileTap={{ scale: 0.9 }}>
      <Button
        variant="contained"
        onClick={() => onClick(value)}
        sx={{ fontSize: "1.2rem", p: 2 }}
      >
        {value}
      </Button>
    </motion.div>
  );
}
