import { Box, Typography } from "@mui/material";

export default function Display({ value, darkMode }) {
  return (
    <Box
      sx={{
        width: "100%",                // 🔥 hace que coincida con teclado
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
        {value || "0"}
      </Typography>
    </Box>
  );
}
