import { Box, Typography } from "@mui/material";

export default function Display({ value, darkMode }) {
  return (
    <Box
      sx={{
        width: "100%",               // 🔥 Asegura que coincida con el keypad
        p: 2,
        mb: 1,
        borderRadius: 2,
        bgcolor: darkMode ? "#121212" : "#f0f0f0",
        textAlign: "right",
        minHeight: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        overflowX: "auto",
        boxSizing: "border-box",     // 🔥 Evita que crezca de más
      }}
    >
      <Typography
        variant="h5"
        sx={{
          wordBreak: "break-word",
          width: "100%",
        }}
      >
        {value || "0"}
      </Typography>
    </Box>
  );
}
