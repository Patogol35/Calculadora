import { Box, Typography, Paper } from "@mui/material";

export default function History({ history, darkMode, setInput }) {
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
      {history.length === 0 ? (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Sin operaciones aún...
        </Typography>
      ) : (
        history.map((item, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              textAlign: "right",
              wordBreak: "break-word",
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
            }}
            onClick={() => {
              const expr = item.split("=")[0].trim();
              setInput(expr);
            }}
          >
            {item}
          </Typography>
        ))
      )}
    </Paper>
  );
}
