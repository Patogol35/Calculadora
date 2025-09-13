import { Paper, Typography } from "@mui/material";

export default function Display({ expression, result }) {
  const formatNumber = (num) => {
    if (!num || isNaN(num)) return num;
    return Number(num).toLocaleString("en-US");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        textAlign: "right",
        mb: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h6">{expression || "0"}</Typography>
      <Typography variant="h5" sx={{ color: "primary.main" }}>
        {formatNumber(result)}
      </Typography>
    </Paper>
  );
}
