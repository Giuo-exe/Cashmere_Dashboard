import { IResourceComponentsProps, useShow } from "@refinedev/core";
import React, { useEffect, useState } from 'react'
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
import { grey } from "@mui/material/colors";
import { DataGrid } from "@mui/x-data-grid";
import columns from "components/grid/FatturaGridShow";

const FatturaShow : React.FC<IResourceComponentsProps> = () => {
    const navigate = useNavigate();

    const { mutate: deleteFattura } = useDelete(); // Per la cancellazione
    const { mutate: updateFattura } = useUpdate(); // Per l'aggiornamento
    const { id } = useParams();
    const {queryResult} = useShow();

    const { data, isLoading, isError } = queryResult;

    const Fattura = data?.data ?? {};

    const [pagato, setPagato] = useState(Fattura?.pagato || false); // stato per il checkbox
    const [rows, setRows] = useState([]); // State for rows


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

    console.log(Fattura);
    
    let incassato = 0;
      Fattura.allPagamenti?.forEach((pagamento: PagamentiGridProps) => {
          incassato += pagamento.ammount.valueOf();
      });

    const percentualeIncasso = incassato / Fattura?.totale;

    let nome = Fattura.cliente != null ? Fattura.cliente.name : ""

    const dataFattura : string = new Date(Fattura?.data).toLocaleDateString()

    useEffect(() => {
      // Declare newRows inside the useEffect hook
      let newRows : any = [];
  // colore
  
      if (Fattura?.allDdt) {
          Fattura.allDdt.forEach((ddt: any) => {
            console.log(Fattura)
              ddt.beni.forEach((bene: any) => {
                  const colore = bene?.colore?.name || 'N/A';
                  const codice = bene?.colore?.codice || 'N/A';
                  const descrizione = `Maglieria di Cashmere Colore ${colore}/${codice}`;
                  const matchingKgEntry = Fattura?.idKg.find((kgEntry: any) => kgEntry.id === bene._id);
                  const prezzo = matchingKgEntry ? matchingKgEntry.kg : 0;
                  const importo = bene?.kg * prezzo;
  
                  newRows.push({
                      descrizione,
                      art: "", // Assuming 'art' is some field you wish to populate
                      qnt: bene?.kg,
                      prezzo,
                      importo
                  });
              });
          });
  
          setRows(newRows); // Update rows state
      }
  }, [Fattura]);


    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

  

  return (
    <>
      <Box p={2} component={Card} variant="outlined" width="70vw" alignSelf="center" alignContent="center">
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant = "h3"> FIBRE PREGIATE SRL</Typography>
            <Typography variant = "h2" color="grey"> FATTURA {`${Fattura.id}`} </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
               <Box>
                  <Typography variant = "body1"> Partita IVA 02508550973</Typography>
                  <Typography variant = "body2"> Via Sabin 11/3</Typography>
                  <Typography variant = "body2"> CAP 59200 Prato(Po)</Typography>
                  <Typography variant = "body2"> Telefono 0574 cell 3927826072</Typography>
               </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
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
            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <Box sx={{padding: "10px"}}>
                <Typography>OGGETTO: RIF. NS. </Typography>
                  {Fattura?.allDdt?.length > 0 ? (
                      Fattura.allDdt.map((ddt : any, index : number) => {
                        const dataFormat : string = new Date(ddt.data).toLocaleDateString()
                        return(
                        <div key={index}>
                          <Typography>DDT {ddt.id} DEL {dataFormat} </Typography>
                        </div>
                  )})) : (<Typography>No DDT </Typography>)}
                </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <Card variant="outlined" square>
                <Stack>
                  <Typography>DATA: {dataFattura}</Typography>
                  <Typography>NUMERO: {Fattura?.id}</Typography>

                </Stack>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={autoIncrementId(rows)}
                columns={columns}
                hideFooterPagination={true}
                sx={{
                boxShadow: 2,
                border: 2,
                borderColor: "peachpuff"
                }}
            />
          </Box>

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
            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
              <Infobox
                title="Pagamenti"
                list={Fattura.allPagamenti}
                fatturaid={Fattura._id}
                navigation=""
                rimanente={((Fattura.totale as number) - (incassato as number))}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}> 
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
    </>
  );
};


function autoIncrementId(rows: any[]) {
  let id = 1;
  for (const row of rows) {
    row.id = id++;
  }
  return rows;
}


  


export default FatturaShow;