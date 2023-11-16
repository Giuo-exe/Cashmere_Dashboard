import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LocationCity from "@mui/icons-material/LocationCity";
import Phone from "@mui/icons-material/Phone";
import Place from "@mui/icons-material/Place";
import ArticleIcon from '@mui/icons-material/Article';
import React from 'react'
import {Box, Card, CardContent, Stack,Typography} from "@mui/material"
import { ClienteCardProp, ClienteProps } from 'interfaces/cliente'
import { InfoBarProps } from "interfaces/agent";



const InfoBar = ({ icon, name }: InfoBarProps) => (
    <Stack
        flex={1}
        minWidth={{ xs: "100%", sm: 300 }}
        gap={1}
        direction="row"
    >
        {icon}
        <Typography fontSize={18} color="#808191">
            {name}
        </Typography>
    </Stack>
);

const ClienteShowCard = ({ email,indirizzo,name,telefono,cap,cf,id,noOfFatture,piva,rea,citta } : ClienteCardProp) => {

    const color = ["#cdb4db", "#ffc8dd","#ffafcc","#bde0fe","#a2d2ff"];


    const randomNumber = Math.floor(Math.random() * 100) % color.length;
    const partitaiva = piva !== undefined ? piva : "";
    const reaa = rea !== undefined ? rea : "";
    const cff = cf!== undefined ? cf : "";
    const capp = cap!== undefined ? cap : "";

    


  return (
    <>
        <Box width="auto">
                    <Stack direction="column" gap={1}>
                        <Stack direction="row" gap={2}>
                            <Typography
                                    fontSize={30}
                                    fontWeight={600}
                                    gutterBottom
                                    variant='body1'
                                    color="text.primary"
                                    sx={{
                                        textAlign: "center",
                                    }}>
                                        {name}

                            </Typography>        

                        </Stack>

                        {indirizzo && <Typography variant="body2">Indirizzo: {indirizzo}</Typography>}
                        {cap && <Typography variant="body2">CAP: {cap}</Typography>}
                        {email && <Typography variant="body2">Email: {email}</Typography>}
                        {piva && <Typography variant="body2">P.IVA: {partitaiva}</Typography>}
                        {rea && <Typography variant="body2">REA: {reaa}</Typography>}
                        {cf && <Typography variant="body2">CF: {cff}</Typography>}


                    </Stack>

        </Box>
    </>
  )
}

export default ClienteShowCard