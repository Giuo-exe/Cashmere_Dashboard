import { Button, Card, Paper, Stack, CardActions, CardHeader ,CardContent, Typography, Modal, Box, IconButton} from '@mui/material'
import { ContoTerzi } from "interfaces/lotto"
import CloseIcon from '@mui/icons-material/Close';
import {useState} from "react"
import { FieldValues } from 'react-hook-form';
import ContoTerziShowCard from './ContoTerziShowCard';
import { useShow } from '@refinedev/core';
import { useNavigate } from 'react-router-dom';



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

const ContoTerziCard = ({
    dataentrata,
    datauscita,
    beni,
    lotti,
    ddt,
    contoid, 
    stats
}: ContoTerzi) => {

    const navigate = useNavigate();

    const dataFormat : string = new Date(dataentrata).toLocaleDateString()

    let dalavorare = [...(stats?.beni || [])].reduce((total, dalavorareItem) => total + (dalavorareItem.kg || 0), 0);

    let lavorata = [...(stats?.lavorata || [])].reduce((total, lavorataItem) => total + (lavorataItem.kg || 0), 0);



    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const onFinishHandler = async (data: FieldValues) => {
        handleClose();
    };


    console.log(beni,ddt)

    const color = dalavorare > 0 ? "#A90A0B" : "#4BA4C6"

    const subheader = `DDT N° ${ddt}`
    

    return(
    <>  
        <Paper
            sx={{
                height: 300,
                width: 300,
                borderRadius: 5,
                boxShadow: 3, // Adds shadow for depth
                position: 'relative', // Needed for absolute positioning of the children
                '&:hover': {
                boxShadow: 6, // Shadow increases on hover for interactive feedback
                },
            }}
            >
            <CardHeader
                sx={{
                bgcolor: color,
                borderRadius: "15px 15px 0 0", // Matches the Paper's borderRadius
                color: 'white',
                py: 2,
                }}
                title={`Contoterzi ${dataFormat}`}
                subheader={subheader}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                Elementi dentro Contoterzi: {dalavorare > 0 ? `${dalavorare}Kg` : 'Nessuno'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                Elementi Rientrati: {lavorata > 0 ? `${lavorata}Kg` : 'Nessuno'}
                </Typography>
            </CardContent>
            <CardActions sx={{
                position: 'absolute', // Absolute positioning to place it at the bottom right
                bottom: 16, // Adjust this value as needed
                right: 16, // Adjust this value as needed
                p: 0, // Remove padding if not needed
            }}>
                <Button
                onClick={() => navigate(`/contoterzi/show/${contoid}`)}
                sx={{
                    '&:hover': {
                    transform: 'translateY(-1px)', // Button moves up slightly on hover
                    },
                }}
                >
                Azione
                </Button>
            </CardActions>
        </Paper>
    </>
    )
}

export default ContoTerziCard