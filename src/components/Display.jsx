import { Grid, Box, Typography } from "@mui/material";

export default function Display({ value, darkMode }) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box
          sx={{
            width: "100%",
            p: 2,
            borderRadius: 2,
            bgcolor: darkMode ? "#121212" : "#f0f0f0",
            textAlign: "right",
            minHeight: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            overflowX: "auto",
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="h5"
            sx={{ wordBreak: "break-word", width: "100%" }}
          >
            {value || "0"}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
