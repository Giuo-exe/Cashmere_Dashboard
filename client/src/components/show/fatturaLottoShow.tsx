import { Box, Card, CardActionArea, CardContent, Grid, Paper, Stack, Typography, makeStyles, Button } from "@mui/material"
import CustomButton from "components/common/CustomBotton"
import { FattureLottoProps, PagamentiFattureProps } from "interfaces/fattura"
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import PieChart from "components/charts/PieCharts";


const banner = {
    backgroundColor: '#3C9DBC',
    color: 'white',
    padding: '10px 0',
    margin: "0",
    top: 0,
    left: 0,
    width: '100%'
}
  

const FatturaLottoShow = ({
    _id,
    name,
    totale,
    pagamenti,
    cliente,
    lotto
}: FattureLottoProps)  => {


    console.log(_id)

    let pagato = 0;
    let rimanente = totale as number
    console.log(pagamenti)

    if(pagamenti != undefined){
        console.log("we")
        for(let p of pagamenti){
            pagato += p.ammount;
        }
    }

    const series = () => {
        const array = []
        rimanente = totale as number - pagato

        array.push(pagato)
        array.push(rimanente)

        return(
            array
        )
    }

    const element = {
        lotto: lotto,
        fattura: _id
    }

    const HandleClick = async () =>{
        const response = window.confirm(
            "Sei sicuro di voler aggiungere?"
        );
        if (response) {
            
            try {
            // Esegui la richiesta API per inviare i dati del DDT al database
            // Usa l'oggetto ddt per inviare i dati
            const response = await fetch("https://cashmere-dashboard.onrender.com/api/v1/lotti/addfattura", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(element),
            });
        
            if (response.ok) {
                navigate("/lotti")
            } else {
                console.error("Errore nell'invio della Fattura.");
                alert("Si è verificato un errore nell'invio della Fattura.");
            }
            } catch (error) {
                console.error("Si è verificato un errore durante l'invio della Fattura:", error);
                alert("Si è verificato un errore nell'invio della Fattura.");
            }
        }
    }

    const navigate = useNavigate();

    return(
        <>
            <Card sx={{Width: 400}}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Fattura N° {name}
                    </Typography>

                    <Typography gutterBottom variant="body2" color="text.secondary">
                        Cliente: {cliente}
                    </Typography>

                    <PieChart
                        title="Saldo"
                        value={totale as number}
                        series={series()}
                        labels={["Pagato","Rimanente"]}
                        colors={["#275be8", "#c4e8ef"]}
                        type="€"
                    />
                </CardContent>
                <CardActionArea sx={{ justifyContent: 'flex-end'}}>
                    <Button startIcon = {<Add/>}
                        onClick={HandleClick}>
                            Aggiungi Fattura
                    </Button>
                </CardActionArea>
            </Card>
        </>
    )
}

export default FatturaLottoShow