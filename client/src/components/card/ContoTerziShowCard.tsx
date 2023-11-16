import React, { useState } from 'react'
import {Box, Grid, Typography, Stack, Button, Modal, IconButton, List, ListItem, ListItemIcon, ListItemButton, ListItemText,ListSubheader, Paper, Divider, Card} from "@mui/material"
import { ContoTerziCardProps } from 'interfaces/lotto'
import { useDelete, useShow,useList } from "@refinedev/core";
import PieChart from "../charts/PieCharts"
import { BeneProps } from 'interfaces/grid';
import BiggerPieChart from 'components/charts/BiggerPieChart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { FieldValues } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import ContoTerziForm from 'components/common/ContoTerziForm';
import { useModalForm } from '@refinedev/react-hook-form';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUpdate } from "@refinedev/core";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';



const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

const ContoTerziShowCard = ({
    id,
    Conto
}: ContoTerziCardProps) => {

    console.log(Conto)

    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
        control
    } = useModalForm({
        refineCoreProps: {action:"edit", resource: "contoterzi/lavorata", id}
    });

    const { mutate, isLoading, error } = useUpdate();

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const onFinishHandler = async (data: FieldValues) => {
        
        await onFinish({...data});
        handleClose();
    };

    

    const grayscale = ["#ececec","#e2e2e2","#d8d8d8","#c5c5c5"]


    const dataFormat : string = new Date(Conto.dataentrata).toLocaleDateString()


    const Bseries: number[] = []
    const Blabels: string[] = []
    const Bcolors: string[] = []
    let Bkg = 0
    const Lseries: number[] = []
    const Llabels: string[] = []
    const Lcolors: string[] = []
    let Lkg = 0

    const beniArray = Array.isArray(Conto?.beni) ? Conto.beni : [];
    const lavorataArray = Array.isArray(Conto?.lavorata) ? Conto.lavorata : [];
    const uncheckedArray = Array.isArray(Conto?.unchecked) ? Conto.unchecked : []

    console.log(Conto.beni)
    console.log(lavorataArray)

    

    for(let bene of beniArray){
        Bkg += bene.kg
        Bseries.push(bene.kg as number)
        Blabels.push(bene.colore as string)

        if(bene.hex == "#ffffff" || bene.hex == undefined)
            Bcolors.push(grayscale[(Math.floor(Math.random() * 100) + 1)%grayscale.length])
        else
            Bcolors.push(bene.hex as string)
    }
    console.log(lavorataArray.length)
    for(let lavorata of lavorataArray){
        Lkg += lavorata.kg
        Lseries.push(lavorata.kg as number)
        Llabels.push(lavorata.colore as string)

        if(lavorata.hex == "#ffffff" || lavorata.hex == undefined)
            Lcolors.push(grayscale[(Math.floor(Math.random() * 100) + 1)%grayscale.length])
        else
            Lcolors.push(lavorata.hex as string)
    }



    const handleCheck = (lavorataId: string) => {
        const userConfirmed = window.confirm("Sei sicuro di voler ACCETTARE questo elemento?");
    
        if (userConfirmed) {
            try {
                mutate(
                    { resource: 'contoterzi/checked', id: id, values: {lavorataId} },
                    {
                        onSuccess: () => {
                            window.location.reload()
                        },
                        onError: (error) => {
                            // Gestire l'errore
                        },
                    }
                );
            }catch(error){
            
            }
        }
    };

    const handleDelete = (lavorataId: string) => {

        const userConfirmed = window.confirm("Sei sicuro di voler RIMUOVERE questo elemento?");

        if (userConfirmed) {
            try {
                mutate(
                    { resource: 'contoterzi/removelavorata', id: id, values: {lavorataId} }, // 'values' può essere un oggetto vuoto per DELETE
                    {
                        onSuccess: () => {
                            window.location.reload()
                            // Agire in caso di successo, ad esempio mostrare un messaggio o aggiornare lo stato
                        },
                        onError: (error) => {
                            // Gestire l'errore, ad esempio mostrare un messaggio all'utente
                        },
                    }
                );
            }catch(error){
            
            }
        }
    };

    
    


  return (
    <>
        <Box>
            <Typography fontSize={25} variant='h4'>
                Conto Terzi DDT N° {Conto.ddt[0]?.id}
            </Typography>
            <Typography gutterBottom variant="body1">
                Data Entrata {`${dataFormat}`}
            </Typography>

            {/* Lista cose  */}

                <Paper square sx={{padding : "10px"}}>
                    <Stack>
                    {Bkg > 0 && (
                        <>
                            <Grid container>
                                <Grid item xs={8}>
                                    <Stack direction="column" alignItems="flex-start" spacing={1}>
                                        <nav aria-label="main mailbox folders">
                                            <List  
                                                aria-labelledby="nested-list-subheader"
                                                subheader={
                                                <ListSubheader component="div" id="nested-list-subheader">
                                                Lista Beni
                                                </ListSubheader>
                                            }>
                                                {Conto.beni?.map((item : any, index : number) => (
                                                    <ListItem key={item._id} disablePadding>
                                                        <ListItemIcon>
                                                            {/* Sostituisci con l'icona appropriata */}
                                                            <LocalGroceryStoreIcon /> 
                                                        </ListItemIcon>
                                                        <ListItemText primary={
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <Typography variant='body2' fontWeight="bold">
                                                                    {`${item.lottoname} -`}
                                                                </Typography>
                                                                <Typography variant='body2' fontWeight="bold">
                                                                    {`Cashmere ${item.kg} kg`}
                                                                </Typography>
                                                                <Card sx={{ height: "20px", width: "20px", backgroundColor: `${item.hex}` }} />
                                                                <Typography variant='body2'>
                                                                    {`${item.colore}`}
                                                                </Typography>
                                                                <Typography variant='body2' fontWeight="bold">
                                                                    {`- Balle ${item.n}`}
                                                                </Typography>

                                                            </Stack>
                                                        } />
                                                </ListItem>
                                                ))}
                                            </List>
                                        </nav>
                                    </Stack>
                                </Grid>

                                <Grid item xs={4}>
                                    <BiggerPieChart
                                        title="Beni"
                                        value= {Bkg}
                                        labels={Blabels}
                                        series={Bseries}
                                        colors={Bcolors}
                                        type = "kg"
                                        />
                                </Grid>
                            </Grid>
                            <Button 
                                variant="outlined"
                                endIcon={<LocalShippingIcon />}
                                color="secondary"
                                onClick={handleOpen}> 
                                Tornare merce
                            </Button>

                            <Divider variant="middle" style={{ marginTop: '10px', marginBottom: '10px' }}/>
                        </>
                        
                        )}
                        
                            {/* Need to check  */}
                            {uncheckedArray.length > 0 && (
                            <List
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        Review
                                    </ListSubheader>
                                }>

                                {uncheckedArray?.map((item: any, index: number) => {
                                    const dataagg: string = new Date(item.datauscita).toLocaleDateString();

                                    return (
                                        <ListItem disablePadding key={item.id || index}>
                                            <ListItemIcon>
                                                <LocalGroceryStoreIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`${item.lottoname} -`}
                                                        </Typography>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`Cashmere ${item.kg} kg`}
                                                        </Typography>
                                                        <Card sx={{ height: "20px", width: "20px", backgroundColor: `${item.hex}` }} />
                                                        <Typography variant='body2'>
                                                            {`${item.colore}`}
                                                        </Typography>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`- Balle ${item.n}`}
                                                        </Typography>

                                                        {item.scarto > 0 && (
                                                            <>
                                                            <Typography variant='body2' fontWeight="bold">- Scarto </Typography>
                                                            <Typography variant='body2' >
                                                            {`${parseFloat(item.scarto).toFixed(2)} kg`}
                                                            </Typography>
                                                        </>
                                                        )}

                                                        {item.datauscita && (
                                                            <>
                                                                <Typography variant='body2' fontWeight="bold">- Data uscita </Typography>
                                                                <Typography variant='body2' >
                                                                {`${dataagg}`}
                                                                </Typography>
                                                            </>
                                                        )}

                                                    </Stack>
                                                } />
                                            <IconButton edge="end" aria-label="check" onClick={() => handleCheck(item._id)}>
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        )}
                </Stack>

            </Paper>
            

            {lavorataArray.length > 0 &&(
            <Paper square sx={{ padding: "10px" }}>
                <Stack>
                    <Grid container>
                        <Grid item xs={8}>
                            <Stack direction="column" alignItems="flex-start" spacing={1}>
                                <nav aria-label="main mailbox folders">
                                    <List  
                                        aria-labelledby="nested-list-subheader"
                                        subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            Lavorata
                                        </ListSubheader>
                                    }>
                                        {Conto.lavorata?.map((item: any) => {
                                            const dataagg: string = new Date(item?.datauscita).toLocaleDateString();

                                            return (
                                            <ListItem key={item._id} disablePadding>
                                                <ListItemIcon>
                                                    {/* Sostituisci con l'icona appropriata */}
                                                    <LocalGroceryStoreIcon /> 
                                                </ListItemIcon>
                                                <ListItemText primary={
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`${item.lottoname} -`}
                                                        </Typography>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`Cashmere ${item.kg} kg`}
                                                        </Typography>
                                                        <Card sx={{ height: "20px", width: "20px", backgroundColor: `${item.hex}` }} />
                                                        <Typography variant='body2'>
                                                            {`${item.colore}`}
                                                        </Typography>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`- Balle ${item.n}`}
                                                        </Typography>

                                                        {item.scarto > 0 && (
                                                            <>
                                                            <Typography variant='body2' fontWeight="bold">- Scarto </Typography>
                                                            <Typography variant='body2' >
                                                            {`${parseFloat(item.scarto).toFixed(2)} kg`}
                                                            </Typography>
                                                        </>
                                                        )}

                                                        {item.datauscita && (
                                                            <>
                                                                <Typography variant='body2' fontWeight="bold">- Data uscita </Typography>
                                                                <Typography variant='body2' >
                                                                {`${dataagg}`}
                                                                </Typography>
                                                            </>
                                                        )}

                                                    </Stack>
                                                } />
                                            </ListItem>
                                        )})}
                                    </List>
                                </nav>
                            </Stack>
                        </Grid>

                        <Grid item xs={4}>
                            <BiggerPieChart
                                title="Lavorata"
                                value={Lkg}
                                labels={Llabels}
                                series={Lseries}
                                colors={Lcolors}
                                type="kg"
                            />
                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
            )}
            
        </Box>
        
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description">
                            
            <Box sx={{ ...style, width: 1200 }}>

                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Contoterzi DDT N° 
                    <IconButton onClick={handleClose} color="primary" sx={{float:"right"}}><CloseIcon/>
                    </IconButton>
                </Typography>

                <ContoTerziForm 
                    type='Create'
                    register={register}
                    onFinish={onFinish}
                    formLoading={formLoading}
                    handleSubmit={handleSubmit}
                    control = {control}
                    onFinishHandler={onFinishHandler}
                    id={id}
                    beni={Conto.beni}
                />
            </Box>
        </Modal>
    </>
  )
}

export default ContoTerziShowCard

