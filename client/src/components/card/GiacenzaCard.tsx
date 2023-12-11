import React, { useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, Grid } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
    '&:hover': {
      boxShadow: theme.shadows[4],
    }
  }));
  
  const LavorataPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  }));
  
  const LoadMoreButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  }));
  
  const GiacenzaCard = ({ item }: { item: any }) => {
    const [visibleItems, setVisibleItems] = useState(10);
  
    const loadMore = () => {
      setVisibleItems(prevVisibleItems => prevVisibleItems + 10);
    };
  
    const isLavorataArray = Array.isArray(item?.lavorata);
  
    return (
        <Paper sx={{ backgroundColor: item.colorInfo?.hex, padding: 2, marginBottom: 2 }} elevation={3}>
          <Typography variant="h6">Colore: {item.colorInfo?.name} (Codice: {item.colorInfo?.codice})</Typography>
          <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
            Kg Totali: {item?.totalKg}
          </Typography>
          <Grid container spacing={2}>
            {item.lavorata.slice(0, visibleItems).map((lavorata: any, index: number) => (
              <React.Fragment key={index}>
                <Grid item xs={12} md={5}>
                  <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }} elevation={2}>
                    <Typography variant="body1">DDT Contoterzi: {lavorata.contoterzi?.ddt?.id}</Typography>
                    <Typography variant="body1">Kg Originali: {lavorata.contoterzi?.beni?.find((bene: any) => bene._id === lavorata.beneId)?.kg}</Typography>
                    <Typography variant="body1">Codice Colore: {lavorata.contoterzi?.beni?.find((bene: any) => bene._id === lavorata.beneId)?.colore?.codice}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowForwardIosIcon />
                </Grid>
                <Grid item xs={12} md={5}>
                  <Paper sx={{ padding: 2, backgroundColor: '#f0f0f0' }} elevation={2}>
                    <Typography variant="body1">Data Uscita: {new Date(lavorata.dataUscita).toLocaleDateString()}</Typography>
                    <Typography variant="body1">DDT Uscita: {lavorata.ddtUscita}</Typography>
                    <Typography variant="body1">Kg Lavorata: {lavorata.kg}</Typography>
                  </Paper>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          {visibleItems < item.lavorata.length && (
            <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
              <Button variant="contained" onClick={loadMore}>
                Carica altro
              </Button>
            </Box>
          )}
        </Paper>
      );
    
  };

export default GiacenzaCard;