import { Box, Card, CardActionArea, CardContent, Grid, Paper, Stack, Typography, makeStyles, Button } from "@mui/material"
import CustomButton from "components/common/CustomBotton"
import { PagamentiFattureProps } from "interfaces/fattura"
import { useNavigate } from "react-router-dom";
import { Add } from "@mui/icons-material";
import PieChartPagamenti from "components/charts/PieChartPagamenti";


const banner = {
    backgroundColor: '#3C9DBC',
    color: 'white',
    padding: '10px 0',
    margin: "0",
    top: 0,
    left: 0,
    width: '100%'
}
  

const PagamentiFattura = ({
    _id,
    name,
    totale,
    pagamenti,
    cliente
}: PagamentiFattureProps)  => {


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

                    <PieChartPagamenti
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
                        onClick={() => navigate(`/pagamenti/create`, {state: {
                            fatturaId: _id,
                            rimanente: rimanente
                        }})}>
                            Pagamento
                    </Button>
                </CardActionArea>
            </Card>
        </>
    )
}

export default PagamentiFattura