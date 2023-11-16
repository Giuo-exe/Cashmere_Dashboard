import PieChart from "../charts/PieCharts"
import { Card, Grid, Stack, Typography, CardActionArea, Button } from '@mui/material'
import { DdtCard } from 'interfaces/ddt'
import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom"

const DdtVenditaCardView = ({titolo, data, kg, destinatario, beni, id, idfattura} : DdtCard) => {

    const series: number[] = []
    const labels: string[] = []
    const colors: string[] = []

    const grayscale = ["#ececec","#e2e2e2","#d8d8d8","#c5c5c5"]

    const navigate = useNavigate();


    console.log(beni)

    const ddt = {
        id: idfattura, 
        ddt: id,
    }
    console.log(ddt)

    const submit = async () => {
        try {
            // Esegui la richiesta API per inviare i dati del DDT al database
            // Usa l'oggetto ddt per inviare i dati
            const response = await fetch("https://cashmere-dashboard.onrender.com/api/v1/fatture/addddt", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(ddt),
            });
      
            if (response.ok) {
              alert("DDT inviato con successo!");
              navigate(`fatture/${idfattura}`)
            } else {
              alert("Errore nell'invio del DDT");
            }
          } catch (error) {
            console.error("Si è verificato un errore durante l'invio del DDT:", error);
          }
    }


    for(let bene of beni){
        series.push(bene.kg as number)
        labels.push(bene.colore as string)

        if(bene.hex == "#ffffff" || bene.hex == undefined)
            colors.push(grayscale[(Math.floor(Math.random() * 100) + 1)%grayscale.length])
        else
            colors.push(bene.hex as string)
    }

    console.log(series,labels,colors)

  return (
    <>
        <Card sx={{minWidth: 600, height: "100%",backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#212121' : '#fff'}}>
            <Grid container sx={{margin: "10px"}}>
                <Grid item xs={6}> 
                    <Stack gap={2} sx={{ padding: "10"}}>
                        <Typography gutterBottom variant='body1' fontSize={24}>
                            DDT N° {titolo}
                        </Typography>

                        <Typography gutterBottom variant='body2'>
                            Cliente: {destinatario}
                        </Typography>

                        <Typography gutterBottom variant='body2'>
                            Data {data}
                        </Typography>

                        <Typography gutterBottom variant='body2'>
                            Kg {kg}
                        </Typography>

                    </Stack>
                </Grid>

                

                <Grid item xs={6}>
                    <PieChart
                            title="Beni"
                            value= {kg}
                            labels={labels}
                            series={series}
                            colors={colors}
                            type=" kg"
                        />
                    </Grid>
            </Grid>

            <CardActionArea>
                <Button onClick={submit}>
                    + Add
                </Button>
            </CardActionArea>

        </Card>
    </>
  )
}

export default DdtVenditaCardView