import { Paper, Typography, List, ListItem, Divider } from "@mui/material";

export default function History({ history, onSelect }) {
  return (
    <Paper elevation={2} sx={{ p: 2, maxHeight: 200, overflow: "auto" }}>
      <Typography variant="subtitle1">Historial</Typography>
      <List>
        {history.map((h, index) => (
          <div key={index}>
            <ListItem
              button
              onClick={() => onSelect(h.expr)}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{h.expr}</span>
              <strong>{h.res}</strong>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Paper>
  );
}
