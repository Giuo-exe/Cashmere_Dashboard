import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import React from 'react'
import ClienteShowCard from './ClienteShowCard';
import { DataGrid } from '@mui/x-data-grid';
import { DdtProps } from 'interfaces/ddt';
import { useDelete, useShow } from "@refinedev/core";
import columns from 'components/grid/DdtShowGrid';
import { BeneProps, BeniGridProps } from 'interfaces/grid';
import CustomButton from 'components/common/CustomBotton';
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const DdtShowCard = ({causale,id,data,destinatario,destinazione,beni,tara,_id} : DdtProps) => {

    const { mutate } = useDelete();
    

    const handleDeleteFattura = () => {
        const response = window.confirm(
            "Sei sicuro di voler cancellare il DDT? Verrà cancellato il CONTOTERZI associato e verranno aggiornati i Kg dei Lotti"
        );
        if (response) {
            mutate(
                {
                    resource: "ddt",
                    id: _id as string,
                },
                {
                    onSuccess: () => {
                        navigate("/ddt");
                    },
                },
            );
        }
      };

    const navigate = useNavigate()
    const dataFormat : string = new Date(data).toLocaleDateString()

    console.log(beni)

    let kgtot = 0;

    beni.forEach((bene: any) => {
        kgtot += bene.kg.valueOf();
    })

    const rows = getRows(beni)

  return (
    <Box alignContent="center" justifyContent="center" display="flex" >
        <Stack direction="column">
                <Paper square elevation={2}>
                    <Grid container alignItems="center">
                        <Grid item xs sx={{padding: "10"}}>
                            <Typography gutterBottom variant="h4" color="text.primary">
                                DOCUMENTO DI TRASPORTO
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{padding: "10px"}}>
                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{ gridRow: 'span 2' }} height="auto">
                            <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}}>
                                <Typography gutterBottom variant="body2" color="secondary.text">
                                    MITTENTE
                                </Typography>
                                <ClienteShowCard
                                        indirizzo={"Via Albert Bruce Sabin, 11/3"}
                                        name={"FibrePregiate s.r.l."}
                                        cap={"59100"}
                                        citta={"PRATO(PO)"}
                                        id={"me"}
                                        piva={"0250855097"}
                                    />
                            </Paper>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{ gridRow: 'span 2' }} height="auto">
                            <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}}>
                                <Typography gutterBottom variant="body2" color="text.secondary">
                                    DESTINATARIO
                                </Typography>
                                <ClienteShowCard
                                    email={destinatario.email}
                                    indirizzo={destinatario.indirizzo}
                                    name={destinatario.name}
                                    telefono={destinatario.telefono}
                                    cap={destinatario.cap}
                                    cf={destinatario.cf}
                                    id={destinatario.id}
                                    piva={destinatario.piva}
                                    rea={destinatario.rea}
                                />
                            </Paper>
                        </Grid>
                        

                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} height="auto">
                            <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}}>
                                <Typography gutterBottom variant="body2" color="text.secondary">
                                    CAUSALE DEL TRASPORTO
                                </Typography>
                                <Typography gutterBottom variant="body1" color="text.primary">
                                    {causale == "contoterzi" ? "LAVORAZIONE CONTO TERZI" : "MERCE C/VENDITA"}
                                </Typography>
                                
                            </Paper>
                        </Grid>

                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6} height="auto">
                            <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}} >
                                <Typography gutterBottom variant="body2" color="text.secondary">
                                    DOCUMENTO DI TRASPORTO
                                </Typography>
                                <Stack direction="row" gap={2}>
                                    <Typography gutterBottom variant="body1" color="text.primary">
                                        N. {id} DEL {dataFormat}
                                    </Typography>
                                </Stack>
                                
                            </Paper>
                        </Grid>

                        

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}}>
                                    <Typography gutterBottom variant="body2" color="secondary.text">
                                        LUOGO DI DESTINAZIONE
                                    </Typography>

                                    <Typography gutterBottom variant="body2" color="secondary.text">
                                        {destinazione}
                                    </Typography>
                                </Paper>
                        </Grid>
                    </Grid>

                    <Box
                        p={4}
                        id="chart"
                        minWidth={490}
                        display="flex"
                        flexDirection="column"
                        borderRadius="15px"
                        gap={4}
                    >

                        <Box sx={{ height: 400, width: '100%' }}>
                            <DataGrid
                                rows={autoIncrementId(rows)}
                                columns={columns}
                                hideFooterPagination={true}
                                sx={{
                                    boxShadow: 2,
                                    border: 2,
                                    borderColor: "peachpuff",
                                    backgroundColor: (theme) => theme.palette.mode === 'dark' ?  '#1A2027': '#fff' 
                                }}
                            />
                            </Box>
                    </Box>
                    

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Box
                                p={4}
                                width={300}
                                top={0}
                                right={0}
                                bottom={0}
                                display="flex"
                                alignContent="flex-end"
                                justifyContent="flex-end"
                                flexDirection="column"
                                gap={4}>

                                <Stack justifyContent="flex-start" alignItems="start" direction="column" gap={2}>
                                
                                    <Typography gutterBottom>
                                            Totale Netto: {kgtot} Kg
                                    </Typography>

                                    <Stack direction="row" alignItems="flex-end" gap={2}>
                                        <Typography gutterBottom>
                                            Totale Tara: {tara} Kg
                                        </Typography>
                                    </Stack>

                                    <Typography gutterBottom>
                                        Totale Lordo: {kgtot + tara} Kg
                                    </Typography>
                                </Stack>
                            </Box>  
                        </Grid>
                    </Grid>
                </Paper>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{marginTop: "16px"}} >
                    <Stack direction="row" spacing={2} justifyContent="space-evenly"  alignContent="center">
                        <CustomButton
                            title="Modifica"
                            handleClick={() => navigate(`/ddt/edit/${id}`)}
                            backgroundColor="#757D79"
                            color="#fcfcfc"
                            icon={<EditIcon/>}/>
                        <CustomButton
                            title="Cancella"
                            handleClick={() => {handleDeleteFattura()}}
                            backgroundColor="#D40404"
                            color="#fcfcfc"
                            icon={<DeleteIcon/>}/>
                    </Stack>
                </Grid>
            </Stack>
        </Box>
  )
}

function getRows (beni: any)  {

    const rows: BeniGridProps[] = []; // Initialize an empty array to hold the transformed data

    console.log(beni)
    if (Array.isArray(beni)) {
        beni.forEach((index) => {

        const hex = index.hex != null ? index.hex : ""
        const name = index.lotto.name
        const bene = name + " - Maglieria di cashmere " + index.colore;
      
          rows.push({
            bene: bene,
            hex: hex,
            kg: index.kg,
            n: index.n
          });
        });
    } else {
    // Se 'beni' non è un array, puoi comunque aggiungere un oggetto 'row' con valori vuoti o predefiniti
        const name = beni.lotto.name
        const hex = beni.hex != null ? beni.hex : ""
        const bene = name + " - Maglieria di cashmere " + beni.colore;

        //(beni.lotto.name as string) + "- Maglieria di cashmere " + beni.colore;
        rows.push({
            bene: name,
            kg: beni.kg,
            n: beni.n,
            hex: hex
        });
    }

    return rows
}

function autoIncrementId(rows: any[]) {
    let id = 1;
    for (const row of rows) {
      row.id = id++;
    }
    return rows;
}

export default DdtShowCard