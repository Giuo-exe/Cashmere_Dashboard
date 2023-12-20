import React, { useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Grid, Card, Stack } from '@mui/material';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { styled } from '@mui/material/styles';

const StyledHeader = styled(Box)(({ theme }) => ({
  
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  // Remove padding here if you want the header to be full width
  marginTop: theme.spacing(2),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
  // Rest of your styles...
}));
  
  const GiacenzaCard = ({ item }: { item: any }) => {
    const [visibleItems, setVisibleItems] = useState(5);

    const getKgDifferenceColor = (originalKg : number, lavorataKg : number) => {
      const difference = lavorataKg - originalKg;
      if (difference > 0) return 'green';
      if (difference < 0) return 'red';
      return 'blue';
    };

    console.log(item)
  
    const loadMore = () => {
      setVisibleItems(prevVisibleItems => prevVisibleItems + 5);
    };
  
    const isLavorataArray = Array.isArray(item?.lavorata);
  
    return (
      <>
        <StyledPaper elevation={3}>
          <StyledHeader bgcolor={item.colorInfo?.hex || '#ddd'}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography variant="h6">
                {item.colorInfo?.name}/{item.colorInfo?.codice}
              </Typography>
            </Stack>
          </StyledHeader>
          <Grid container spacing={2}>
            {item.lavorata.slice(0, visibleItems).map((lavorata: any, index: number) => {
              const originalBene = lavorata?.contoterzi?.beni?.find((bene: any) => bene._id === lavorata.beneId);
              const contoterziDDT = originalBene ? lavorata?.contoterzi?.ddt?.id : null;

              if (!originalBene) {
                console.log("originalBene not found for beneId:", lavorata.beneId);
              }

              return (
                <React.Fragment key={index}>
                  {originalBene && (
                    <>
                      <Grid item xs={12} md={5} sx={{margin: 1}}>
                        <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }} elevation={2}>
                        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2">
                              DDT Entrata: {contoterziDDT}
                            </Typography>
                            <Typography variant="body2">
                              Balle: {originalBene?.n}
                            </Typography>
                            <Typography variant="body2">
                              Colore: {item?.colorInfo?.name}/{item?.colorInfo?.codice}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'darkslategray' }}>
                            Totale Kg: {originalBene?.kg}
                          </Typography>
                        </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" style={{ color: getKgDifferenceColor(originalBene.kg, lavorata.kg) }}>
                          {(lavorata.kg - originalBene.kg).toFixed(2)} Kg
                        </Typography>
                        <TrendingFlatIcon />
                      </Grid>
                    </>
                    )}
                    <Grid item xs={12} md={5} sx={{margin: 1}}>
                      <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }} elevation={2}>
                        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2">
                              DDT Uscita: {lavorata.ddtuscita}
                            </Typography>
                            <Typography variant="body2">
                              Balle: {lavorata?.n}
                            </Typography>
                            <Typography variant="body2">
                              Colore: {item?.colorInfo?.name}/{item?.colorInfo?.codice}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1rem', color: 'darkslategray' }}>
                            Totale Kg: {lavorata.kg}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  </React.Fragment>
                );
              })}
              </Grid>

              <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
                {visibleItems < item.lavorata.length && (
                  <Button variant="contained" onClick={() => setVisibleItems(visibleItems + 5)}>
                    Carica altro
                  </Button>
                )}
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#373D3F', fontWeight: 'bold' , margin: 1}}>
                Tot: {item.totalKg.toFixed(2)} Kg
              </Typography>
        </StyledPaper>
      </>
      );
    
  };

export default GiacenzaCard;