import React from 'react';
import { Box, Paper, Typography, Grid, Card, Stack } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const ListLavorataCard = (data: any) => {
  const dataArray = Object.values(data);
  console.log(dataArray)

  const getKgDifferenceColor = (originalKg : number, lavorataKg : number) => {
    const difference = lavorataKg - originalKg;
    if (difference > 0) return 'green';
    if (difference < 0) return 'red';
    return 'blue';
  };


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
                            <Stack direction="row" spacing={1}>
                              <Typography variant="body2">DDT: {contoterziDDT} Kg: {originalBene?.kg} Balle: {originalBene?.n} Colore: {lavoro?.colore?.name}/{lavoro?.colore?.codice}</Typography>
                              <Card 
                                sx={{height:"20px", width:"20px", backgroundColor:`${lavoro?.colore?.hex}`}}
                              />
                            </Stack>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} md={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="body2" style={{ color: getKgDifferenceColor(originalBene.kg, lavoro.kg) }}>
                            {lavoro.kg - originalBene.kg} Kg
                          </Typography>
                          <TrendingFlatIcon /> {/* Custom arrow icon */}
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} md={5}>
                      <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }} elevation={2}>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="body2"> Lavorata: {lavoro.kg} Kg Colore: {lavoro?.colore?.name}/{lavoro?.colore?.codice}</Typography>
                          <Card 
                              sx={{height:"20px", width:"20px", backgroundColor:`${lavoro?.colore?.hex}`}}
                            />
                        </Stack>
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