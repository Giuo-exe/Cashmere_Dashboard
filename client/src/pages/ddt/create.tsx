import React, { useEffect , useState} from "react";

import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import {  useParams } from "react-router-dom";
import { Box, Card, CardContent, Grid, Paper, Stack, Typography,FormControl, Autocomplete, TextField, Button, Checkbox } from "@mui/material";
import { useList } from "@refinedev/core";
import { useCart } from "utils/CartContext";
import { BeneProps, BeniGridProps } from "interfaces/grid";
import { DataGrid, GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import columns from "components/grid/DdtContoShowGrid";
import columnsVendita from "components/grid/DdtVenditaShowGrid";
import ClienteShowCard from "components/card/ClienteShowCard";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';



const DdtCreate = () => {
    const { cart } = useCart();

    const {type} = useParams();

    const allClienti = GetClienti(type)

    const nomi = allClienti.map((clienti ) => clienti.name)

    const [selectedCliente, setSelectedCliente] = useState(null);
    const [selectedClienteID, setSelectedClienteID] = useState(null);
    const [selectedLottoID, setSelectedLottoID] = useState(null);
    const [ddtNumber, setDdtNumber] = useState("");
    const [selectedDate, setDate] = useState(new Date());
    const [selectedClienteAddress, setSelectedAddress] = useState("");
    const [taraNumber, setTaraNumber] = useState(1);

    console.log(cart)

    const ddt = {
        causale: type, 
        data: selectedDate, 
        destinatario: selectedClienteID, 
        destinazione: selectedClienteAddress, 
        beni: cart, 
        tara: taraNumber 
    }

    const pesoNetto = cart?.reduce((total, carrello) => {
        return total + carrello.kg;
    }, 0);

    const [pesoLordo, setPesoLordo] = useState(pesoNetto+taraNumber);


    const handleClienteChange = (event: unknown, newValue: any) => {
        setSelectedCliente(newValue);

        if (newValue) {
            const foundCliente = allClienti.find((cliente) => cliente.name === newValue);
            if (foundCliente) {
                console.log(foundCliente)
                const { cap, citta, indirizzo, _id } = foundCliente;
                setSelectedClienteID(_id);
                setSelectedAddress(`${cap}, ${citta} - ${indirizzo}`);
            }
        } else {
            setSelectedAddress(""); // Clear the address when no client is selected
        }
    };

    const handleTaraChange = (event: unknown, newValue: any) => {
        setTaraNumber(newValue)
        setPesoLordo(pesoNetto + newValue)
    }
    
      useEffect(() => {
        console.log(ddt);
      }, [ddt]);



    const handleAddressChange = (event: unknown, newValue: any) => {
        setSelectedAddress(newValue)
    }
    const handleNDdtChange = (event: unknown, newValue: any) => {
        setDdtNumber(newValue);
    };
    const handleDateChange = (event: unknown, newValue: any) => {
        setDate(newValue);
    };

    // Cerca il cliente selezionato in allClienti
    const getSelectedClienteDetails = () => {
        if (selectedCliente) {
        const foundCliente = allClienti.find(cliente => cliente.name === selectedCliente);
        return foundCliente;
        }
        return null;
    };

    // Ottieni i dettagli del cliente selezionato
    const selectedClienteDetails = getSelectedClienteDetails();
    //let nomi = ["luca","giorgio"]

    console.log(selectedClienteDetails)



    const onSubmit = async () => {
        try {
          // Esegui la richiesta API per inviare i dati del DDT al database
          // Usa l'oggetto ddt per inviare i dati
          const response = await fetch("/ddt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ddt),
          });
    
          if (response.ok) {
            console.log("DDT inviato con successo!");
          } else {
            console.error("Errore nell'invio del DDT.");
          }
        } catch (error) {
          console.error("Si è verificato un errore durante l'invio del DDT:", error);
        }
      };



    const rows = getCartRows(cart)

    console.log(rows)

    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
    } = useForm();

    
    const onFinishHandler = async (data: FieldValues) => {
        console.log(data)
        await onFinish({...ddt});
    };

    return (
        <>
            <Box bgcolor="#fcfcfc" alignContent="center" justifyContent="center" display="flex"> 
                <form onSubmit={handleSubmit(onFinishHandler)}>

                    <Paper square elevation={2}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography gutterBottom variant="h4" color="text.primary">
                                    DOCUMENTO DI TRASPORTO
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    endIcon={<LocalShippingIcon />}
                                    color="secondary"
                                >
                                    Invia
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{padding: "10px"}}>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{ gridRow: 'span 2' }} height="auto">
                                <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}}>
                                    <Typography gutterBottom variant="body2" color="secondary.text">
                                        MITTENTE
                                    </Typography>
                                    <ClienteShowCard
                                            indirizzo={"Via Albert Bruce Sabin, 11/3"}
                                            name={"FibrePregiate s.r.l."}
                                            cap={"59100"}
                                            citta={"PRATO(PO)"}
                                            id={"me"}
                                            piva={"0250855097"}
                                        />
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{ gridRow: 'span 2' }} height="auto">
                                <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        DESTINATARIO
                                    </Typography>
                                    <Autocomplete
                                            sx={{padding: "5px"}}
                                            id={`Cliente`}
                                            options={nomi}
                                            value={selectedCliente} // Imposta il valore selezionato
                                            onChange={handleClienteChange} // Gestisci il cambio di valore
                                            renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={"Cliente"}
                                                color="info"
                                                variant="standard"
                                                required
                                            />
                                            )}
                                        />
                                        {selectedClienteDetails && (
                                            <ClienteShowCard
                                                email={selectedClienteDetails.email}
                                                indirizzo={selectedClienteDetails.indirizzo}
                                                name={selectedClienteDetails.name}
                                                telefono={selectedClienteDetails.telefono}
                                                cap={selectedClienteDetails.cap}
                                                cf={selectedClienteDetails.cf}
                                                id={selectedClienteDetails._id}
                                                piva={selectedClienteDetails.piva}
                                                rea={selectedClienteDetails.rea}
                                            />
                                        )}
                                </Paper>
                            </Grid>
                            

                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} height="auto">
                                <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}}>
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        CAUSALE DEL TRASPORTO
                                    </Typography>
                                    <Typography gutterBottom variant="body1" color="text.primary">
                                        {type == "contoterzi" ? "LAVORAZIONE CONTO TERZI" : "MERCE C/VENDITA"}
                                    </Typography>
                                    
                                </Paper>
                            </Grid>

                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} height="auto">
                                <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}} >
                                    <Typography gutterBottom variant="body2" color="text.secondary">
                                        DOCUMENTO DI TRASPORTO
                                    </Typography>
                                    <Stack direction="row" gap={2}>

                                        <TextField
                                            id="date"
                                            label="Data"
                                            type="date"
                                            variant="standard"
                                            value={selectedDate.toISOString().substr(0, 10)} // Converti selectedDate in una stringa nel formato "YYYY-MM-DD"
                                            onChange={(e) => setDate(new Date(e.target.value))} 
                                            required
                                        />
                                        </Stack>
                                    
                                </Paper>
                            </Grid>

                            

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                <Paper square variant="outlined" sx={{padding: "10px",height:"auto"}}>
                                        <Typography gutterBottom variant="body2" color="secondary.text">
                                            LUOGO DI DESTINAZIONE
                                        </Typography>

                                        <TextField
                                            sx={{width: "40%"}}
                                            id="destinazione"
                                            label="Destinazione"
                                            type="text"
                                            variant="standard"
                                            value= {selectedClienteAddress}
                                            // value={selectedClienteDetails && `${selectedClienteDetails.cap}, ${selectedClienteDetails.citta} - ${selectedClienteDetails.indirizzo}`}
                                            onChange={(e) => setSelectedAddress(e.target.value)} // Usa l'handler handleDateChange per aggiornare selectedDate
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                    </Paper>
                            </Grid>
                        </Grid>

                        <Box
                            p={4}
                            bgcolor="#fcfcfc"
                            id="chart"
                            minWidth={490}
                            display="flex"
                            flexDirection="column"
                            borderRadius="15px"
                            gap={4}
                        >

                            <Box sx={{ height: 400, width: '100%' }}>
                                <DataGrid
                                    rows={autoIncrementId(rows)}
                                    columns={type == "contoterzi" ? columns : columnsVendita}
                                    hideFooterPagination={true}
                                    sx={{
                                    boxShadow: 2,
                                    border: 2,
                                    borderColor: "peachpuff"
                                    }}
                                />
                                </Box>
                        </Box>
                        

                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Box
                                    p={4}
                                    width={300}
                                    top={0}
                                    right={0}
                                    bottom={0}
                                    display="flex"
                                    alignContent="flex-end"
                                    justifyContent="flex-end"
                                    flexDirection="column"
                                    gap={4}>

                                    <Stack justifyContent="flex-start" alignItems="start" direction="column" gap={2}>

                                        <Typography gutterBottom>
                                                Totale Netto: {pesoNetto} Kg
                                        </Typography>

                                        <Stack direction="row" alignItems="flex-end" gap={2}>
                                            <Typography gutterBottom>
                                                Totale Tara:
                                            </Typography>
                                            <TextField
                                                sx={{width: "60px"}}
                                                id="tara"
                                                type="number"
                                                variant="standard"
                                                InputProps={{ inputProps: { min: 0 } }}
                                                placeholder="Kg"
                                                value={taraNumber.toString()}
                                                onChange={(e) => handleTaraChange(e,parseInt(e.target.value, 10))}
                                                InputLabelProps={{ shrink: true }}
                                                required
                                            />
                                        </Stack>

                                        <Typography gutterBottom>
                                            Totale Lordo: {pesoLordo} Kg
                                        </Typography>
                                    </Stack>
                                </Box>  
                            </Grid>
                        </Grid>
                    </Paper>
                </form>
            </Box>
        </>
    );
};

const GetClienti = (type: any) => {
    const { data, isLoading, isError } = useList({ resource: `clienti/type/${type}` });

    const allClienti = data?.data ?? [];
    
    return allClienti;
};

const GetLotto = (type: any) => {
    const { data, isLoading, isError } = useList({ resource: `lotti` });

    const allLotti = data?.data ?? [];
    
    return allLotti;
};

const getCartRows = (cart: any) => {

    const rows: BeniGridProps[] = []; // Initialize an empty array to hold the transformed data

        cart.forEach((index: BeneProps) => {
            const bene = index.lottoname + " - Cashmere " + index.colorename

            console.log(index)

            rows.push({
                bene: bene,
                hex: index.hex,
                kg: index.kg,
                n: index.n
            });
        });
    return rows
}

function autoIncrementId(rows: any[]) {
    let id = 1;
    for (const row of rows) {
      row.id = id++;
    }
    return rows;
}





export default DdtCreate;
