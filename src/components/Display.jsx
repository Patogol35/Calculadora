import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Display({ value, darkMode, animateResult }) {
  const formatNumber = (num) => {
    if (!num) return "0";
    if (!/^[0-9.]+$/.test(num)) return num; 
    return Number(num).toLocaleString("en-US");
  };

  return (
    <motion.div
      animate={animateResult ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          bgcolor: darkMode ? "#121212" : "#f0f0f0",
          textAlign: "right",
          minHeight: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          overflowX: "auto",
        }}
      >
        <Typography variant="h5" sx={{ wordBreak: "break-word" }}>
          {formatNumber(value)}
        </Typography>
      </Box>
    </motion.div>
  );
}
