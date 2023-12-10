
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box ,Paper, makeStyles, Typography, Grid } from '@mui/material';



const ListLavorataCard = ( data : any ) => {
  const dataArray = Object.values(data);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {dataArray.map((item: any) => (
        <Paper sx={{ margin: 2, padding: 2 }} key={item._id} elevation={3}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>DDT Uscita: {item.ddtuscita}</Typography>
          <Typography variant="subtitle1">Data Uscita: {item.datauscita}</Typography>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            {item.lavorata.map((lavoro: any) => (
              <Grid item xs={12} md={6} key={lavoro._id}>
                <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }} elevation={2}>
                  <Typography variant="body1">ID: {lavoro._id}</Typography>
                  <Typography variant="body1">Colore: {lavoro.colore.name}</Typography>
                  <Typography variant="body1">Kg: {lavoro.kg}</Typography>
                  <Typography variant="body1" sx={{ backgroundColor: lavoro.hex, color: '#fff', padding: 1, borderRadius: '4px', display: 'inline-block', marginTop: 1 }}>
                    Hex Colore: {lavoro.hex}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Box>
  );
}
  
export default ListLavorataCard;

