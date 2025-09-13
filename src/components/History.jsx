import { Box, Typography, Paper } from "@mui/material";

export default function History({ history, darkMode }) {
  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        bgcolor: darkMode ? "rgba(255,255,255,0.05)" : "#fafafa",
        maxHeight: 120,
        overflowY: "auto",
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
        Historial
      </Typography>
      {history.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Sin operaciones aún...
        </Typography>
      ) : (
        history.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{ textAlign: "right", wordBreak: "break-word" }}
          >
            {item}
          </Typography>
        ))
      )}
    </Paper>
  );
}
