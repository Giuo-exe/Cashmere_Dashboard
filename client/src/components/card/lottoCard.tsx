
import { Button, Card, CardActionArea, CardContent, Typography} from '@mui/material'
import PieChart from 'components/charts/PieCharts'
import { lottoCardProps } from 'interfaces/lotto'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LottoCard = ({_id, navigazione, name, data, cashmere, contoterzi, stats} : lottoCardProps) => {

  const navigate = useNavigate();
  

  const values = [0, 0, 0, 0, 0];
  let ammount = 0

  console.log(stats)

  if(contoterzi){
    
// Calcolo per cashmere.
  const kgDalavorare = stats.dalavorare.reduce((total: number, dalavorareItem: any) => total + dalavorareItem.kg, 0);
    

    const kgCashmere = stats.cashmere.reduce((total: number, cashmereItem: any) => total + cashmereItem.kg, 0);

    

    // Calcolo per dalavorare.
    

    // Calcolo per lavorata.
    let kgLavorata = stats.lavorata.reduce((total: number, lavorataItem: any) => total + lavorataItem.kg, 0);

    // Calcolo per unchecked.
    const venduta = stats.venduti.reduce((total: number, vendutoItem: any) => total + vendutoItem.kg, 0);
    // Calcolo per scarto.
    const scartoTotal = stats.lavorata.reduce((total: number, lavorataItem: any) => {
      // Assicurati che 'scarto' sia un numero e aggiungilo al totale.
      // L'operatore '+' prima di 'lavorataItem.scarto' assicura che il valore sia trattato come un numero.
      return total + (lavorataItem.scarto || 0);
    }, 0);


    // Sottrai lo scarto da lavorata e aggiungi allo scarto, arrotondando a due cifre decimali.
    kgLavorata = +(kgLavorata - scartoTotal).toFixed(2);
    values[1] = kgDalavorare;
    values[0] = kgCashmere - kgDalavorare;
    values[2] = kgLavorata;
    values[3] = +venduta.toFixed(2);
    values[4] = +scartoTotal.toFixed(2);
    
    console.log(kgCashmere )
    ammount = +(kgCashmere ).toFixed(2);

  }else{
    let kgCashmere = Array.isArray(cashmere) ? 
    cashmere.reduce((total: number, cashmereItem: any) => total + cashmereItem.kg, 0)
    : 0;

    values[0] = kgCashmere
    ammount = kgCashmere
  }

  console.log(values)
 

  const dataFormat : string = new Date(data).toLocaleDateString()



  return (
    <Card sx={{width: 500, height: "100%", backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#212121' : '#fff'}}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>

                    <Typography gutterBottom variant="body2" color="text.secondary">
                        Arrivato il: {dataFormat}
                    </Typography>

                    <PieChart
                        title="Quantità"
                        value= {ammount}
                        labels={["In magazzino","Conto Terzi","Lavorato","Venduta","Scarto"]}
                        series={values}
                        colors={["#355070", "#6d597a","#b56576","#eaac8b","#e56b6f"]}
                        type=" kg"
                    />
                </CardContent>
                <CardActionArea sx={{ justifyContent: 'end'}}>
                    <Button sx={{float: "right"}}
                        onClick={() => (navigate(navigazione))}>
                            Azione
                    </Button>
                </CardActionArea>
            </Card>
  )
}

export default LottoCard