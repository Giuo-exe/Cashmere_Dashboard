import React from 'react';
import { Card, CardContent, Box, Typography, Avatar, Link } from '@mui/material';



// Componente funzionale
const VendutaHistory = ( ddts : any) => {
  // Funzione per ottenere l'iniziale del destinatario
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  console.log(ddts)

  return (
    <Card variant="outlined" sx={{ maxHeight: "400px", overflowY: "auto" }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          {ddts.map((ddt : any, index : any) => {
            const totalKg = ddt.beni.reduce((sum : any, item : any) => sum + item.kg, 0);
            const initial = getInitial(ddt.destinatario);
            const dateObj = new Date(ddt.data);
            const dataFormat = dateObj.toLocaleDateString('it-IT');

            return (
              <React.Fragment key={ddt._id}>
                    <Link href={`/ddt/show/${ddt.id}`} underline="none" sx={{ color: 'inherit', textDecoration: 'none' }}>
                        <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: '#757de8' }}>
                                {initial}
                            </Avatar>
                            <Box ml={2}>
                                <Typography variant="body1">{dataFormat}</Typography>
                                <Typography variant="body2">
                                {`${totalKg} kg`}
                                {ddt.fattura && ` - Fattura n. ${ddt.fattura}`}
                            </Typography>
                            </Box>  
                        </Box>
                    </Link>
                                {/* Condizionalmente renderizzare la connessione tra le azioni se richiesto */}
                    {index !== ddts.length - 1 && (
                        <Box
                            height={50}
                            width={4}
                            sx={{
                            marginLeft: "23px",
                                    // Assumendo che l'array 'colors' sia globale e ogni colore corrisponda a un 'bene'
                                    // backgroundImage: linear-gradient(${colors.find(c => c._id === ddt.beni[0].colore)?.hex}, ${colors.find(c => c._id === ddts[index + 1].beni[0].colore)?.hex})
                                    }}
                        />
                    )}
                    </React.Fragment>
                    );
                })}
            </Box>  
        </CardContent>
    </Card>
                        )};

export default VendutaHistory;