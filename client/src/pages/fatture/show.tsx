import { IResourceComponentsProps, useShow } from "@refinedev/core";
import React, { useState } from 'react'
import { useLocation } from "react-router-dom";
import {Box, Stack, Typography, Card, CardContent, Grid, Button, Divider, FormControlLabel, Checkbox} from "@mui/material";
import { useDelete, useUpdate } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import dataProvider from "@refinedev/simple-rest";
import FatturaGridShow from "components/show/fatturaCardShow";
import { FatturaShowGridProps, PagamentiGridProps } from "interfaces/grid";

import CustomButton from "components/common/CustomBotton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ClienteShowCard from "components/card/ClienteShowCard";
import { Padding } from "@mui/icons-material";
import { ListItem, IconButton, ListItemText } from "@mui/material";
import Infobox from "components/card/InfoBox";

const FatturaShow : React.FC<IResourceComponentsProps> = () => {
    const navigate = useNavigate();

    const { mutate: deleteFattura } = useDelete(); // Per la cancellazione
    const { mutate: updateFattura } = useUpdate(); // Per l'aggiornamento
    const { id } = useParams();
    const {queryResult} = useShow();



    const { data, isLoading, isError } = queryResult;

    const Fattura = data?.data ?? {};

    const [pagato, setPagato] = useState(Fattura?.pagato || false); // stato per il checkbox


    const handleDeleteFattura = () => {
      const response = window.confirm(
          "Sei sicuro di voler cancellare la fattura? I pagamenti ad essa collegati verranno cancellati a sua volta"
      );
      if (response) {
          deleteFattura(
              {
                  resource: "fatture",
                  id: id as string,
              },
              {
                  onSuccess: () => {
                      navigate("/fatture");
                  },
              },
          );
      }
    };

    const handlePagatoChange = (event : any) => {
        const newPagatoStatus : boolean = event.target.checked;
        setPagato(newPagatoStatus);

        updateFattura(
            {
                id: Fattura._id,
                resource: "fatture/pagato",
                values: {pagato : newPagatoStatus}
            },
        );
    };

    console.log(Fattura.allPagamenti);
    
    let incassato = 0;
      Fattura.allPagamenti?.forEach((pagamento: PagamentiGridProps) => {
          incassato += pagamento.ammount.valueOf();
      });

    const percentualeIncasso = incassato / Fattura?.totale;

    let nome = Fattura.cliente != null ? Fattura.cliente.name : ""


    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

  

  return (
    <Box p={2} component={Card} variant="outlined">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
            <Box p={2} component={Card} variant="outlined">
              <Typography variant="h3"> Fattura {`${Fattura.id}`} </Typography>
            </Box>
              <FatturaGridShow
                _id={Fattura._id}
                data={Fattura.data}
                id={Fattura.id}
                cliente={nome}
                totale={Fattura.totale}
                note={Fattura.note}
                scadenza={Fattura.scadenza}
                incassato={incassato}
                pagato={Fattura.pagato}
                allDdt={Fattura.allDdt.length}
                allPagamenti={Fattura.allPagamenti.length}
              />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Card variant="outlined" square>
              <Box sx={{padding: "10px"}}>
                <ClienteShowCard
                  email={Fattura.cliente?.email}
                  indirizzo={Fattura.cliente?.indirizzo}
                  name={Fattura.cliente?.name}
                  telefono={Fattura.cliente?.telefono}
                  cap={Fattura.cliente?.cap}
                  cf={Fattura.cliente?.cf}
                  id={Fattura.cliente?.id}
                  piva={Fattura.cliente?.piva}
                  rea={Fattura.cliente?.rea}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Divider variant="middle" style={{ marginTop: '20px', marginBottom: '20px' }}/>

        {percentualeIncasso > 0.8 && (
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={pagato}
                                onChange={handlePagatoChange}
                                color="primary"
                            />
                        }
                        label="Pagato"
                    />
                </Grid>
            )}

        <Grid container spacing={2} sx={{margin: "10"}}>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <Infobox
              title="Pagamenti"
              list={Fattura.allPagamenti}
              fatturaid={Fattura._id}
              navigation=""
              rimanente={((Fattura.totale as number) - (incassato as number))}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}> 
            <Infobox
              title="DDT"
              fatturaid={Fattura._id}
              list={Fattura.allDdt}
              navigation={`/fatture/addddt/${Fattura.cliente.name}/${Fattura._id}`} 
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Stack direction="row" spacing={2} justifyContent="space-evenly" alignContent="center">
                <CustomButton
                  title="Modifica"
                  handleClick={() => navigate(`/fatture/edit/${Fattura._id}`,)}
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
        </Grid>

    </Box>
  );
};


  


export default FatturaShow;