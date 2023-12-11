import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ListLavorataCard = (data: any) => {
  const dataArray = Object.values(data);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {dataArray.map((item: any) => {
        const dataFormat: string = new Date(item.datauscita).toLocaleDateString();
        
        return (
          <Paper sx={{ margin: 2, padding: 2 }} key={item._id} elevation={3}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>DDT Uscita: {item.ddtuscita}</Typography>
            <Typography variant="subtitle1">Data Uscita: {dataFormat}</Typography>
            <Grid container spacing={2} sx={{ marginTop: 1 }}>
              {item.lavorata.map((lavoro: any) => {
                const originalBene = lavoro?.contoterzi?.beni?.find((bene: any) =>
                  bene._id === lavoro.beneId);

                const contoterziDDT = originalBene ? lavoro?.contoterzi?.ddt?.id : null;
                // Debug log to check if originalBene is found
                if (!originalBene) {
                  console.log("originalBene not found for beneId:", lavoro.beneId);
                }

                return (
                  <React.Fragment key={lavoro._id}>
                    {/* Check if originalBene is defined before rendering */}
                    {originalBene && (
                      <>
                        <Grid item xs={12} md={5}>
                          <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }} elevation={2}>
                            <Typography variant="body1">DDT: {contoterziDDT}</Typography>
                            <Typography variant="body1">Kg: {originalBene?.kg} KG</Typography>
                            <Typography variant="body1">Codice Colore: {originalBene?.colore?.codice}</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ArrowForwardIosIcon />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} md={5}>
                      <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }} elevation={2}>
                        <Typography variant="body1">Codice Colore Lavorata: {lavoro.colore.codice}</Typography>
                        <Typography variant="body1">Kg Lavorata: {lavoro.kg}</Typography>
                      </Paper>
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          </Paper>
        );
      })}
    </Box>
  );
}

export default ListLavorataCard;