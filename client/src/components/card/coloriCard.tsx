import { Button, Box, Stack, Card, CardActionArea, CardContent, Typography, Paper, Grid, IconButton} from '@mui/material'
import { ColoreCardProps } from 'interfaces/colore'
import { useDelete } from "@refinedev/core";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';


const ColoreCard = ({
    _id,
    name,
    codice,
    lotti,
    hex
}: ColoreCardProps) => {
    console.log(hex)

    const { mutate } = useDelete();
    const navigate = useNavigate();


    const handleDeleteFattura = () => {
        const response = window.confirm(
            "Sei sicuro di voler cancellare questo Colore?"
        );
        if (response) {
            mutate(
                {
                    resource: "colori",
                    id: _id as string,
                },
                {
                    onSuccess: () => {
                        navigate("/colori");
                    },
                },
            );
        }
      };

    return(
        <Paper square sx={{maxHeight: 100, maxWidth: 300 ,backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}>
            <CardContent>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Paper variant="outlined"  square sx={{height: 50, width: 50, backgroundColor: hex}} />
                    </Grid>
                    <Grid item xs zeroMinWidth>
                        <Typography noWrap gutterBottom variant="h5" component="div" fontSize={15}>
                            {name}
                        </Typography>

                        <Typography noWrap gutterBottom variant="body2" color="text.secondary" fontSize={14}>
                            {codice}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton aria-label="delete" size="small" onClick={handleDeleteFattura}>
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    </Grid>
                </Grid>
            </CardContent>
        </Paper>
    )
}

export default ColoreCard