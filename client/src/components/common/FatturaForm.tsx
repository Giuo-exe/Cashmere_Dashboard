import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  TextField,
  TextareaAutosize,
  Autocomplete,
  IconButton,
  TableCell,
  TableRow,
  Table,
  TableBody,
  Stack,
  Card,
  CardContent,
  Modal,
  TableHead,
  Checkbox,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { DdtProps, FormFattureProps } from "interfaces/common";
import CustomButton from "./CustomBotton";
import { Bene } from "interfaces/ddt";
import CloseIcon from '@mui/icons-material/Close';


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    minHeight: 500
  };

interface app{
    id : number,
    beni: Array<Bene>
    onCheck: any,
    isChecked: any
}

interface Cliente {
    _id: string
    name: string;
    dataoffset?: number; // Opzionale, con un valore predefinito se non definito
    // Aggiungi qui altre proprietà necessarie per un cliente
  }



const FatturaForm = ({
  type,
  register,
  handleSubmit,
  onFinishHandler,
  formLoading,
  clienti,
  ddts,
  setValue
}: FormFattureProps) => {

const [modalOpen, setModalOpen] = useState(false);

const [dataScadenza, setDataScadenza] = useState(new Date());

const [selectedItems, setSelectedItems] = useState(new Set());

const [dataEmissione, setDataEmissione] = useState(new Date());

const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

const [filteredDdts, setFilteredDdts] = useState<DdtProps[]>([]);

const [prezziPerKg, setPrezziPerKg] = useState<{ [key: string]: number }>({});

const [prezzoTotaleComplessivo, setPrezzoTotaleComplessivo] = useState(0);


const nomi = clienti.map((cliente : any) => cliente.name)

    const calcolaDataScadenza = (dataEmissione : any, giorniOffset : number) => {
        const data = new Date(dataEmissione);
        data.setDate(data.getDate() + giorniOffset);
    
        return data.toISOString().split("T")[0]; // Formatta la data in formato YYYY-MM-DD
    };

    // Aggiungere beni
    const handleCheck = (id : any, isChecked : any) => {
        setSelectedItems((prevSelectedItems) => {
        const newSelectedItems = new Set(prevSelectedItems);
        if (isChecked) {
            newSelectedItems.add(id);
        } else {
            newSelectedItems.delete(id);
        }
        return newSelectedItems;
        });
    };

    const handleClienteChange = (event : any, value : any) => {
      const clienteSelezionato = clienti.find((cliente : any) => cliente.name === value) || { name: value, dataoffset: 0 };
      console.log(clienteSelezionato, dataEmissione)
      setSelectedCliente(clienteSelezionato);
      //console.log("arrivato", dataEmissione , clienteSelezionato)

      if (dataEmissione && !isNaN(dataEmissione.getTime()) && clienteSelezionato) {
          
          const nuovaDataScadenza = calculateDateOffset(dataEmissione, clienteSelezionato.dataoffset);
          console.log("arrivato 2")

          setDataScadenza(nuovaDataScadenza);
      }
    };

    const handleDataEmissione = (event : any) => {
      console.log("New Data Emissione:", event.target.value);
      setDataEmissione(new Date(event.target.value));
  };

    const calculateDateOffset = (startDate : Date, days : number) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + days);
      return date;
    };


    const isChecked = (id : any) => selectedItems.has(id);

    const handleClose = () => {
        setModalOpen(false);
        console.log(selectedItems)
    };

  //   useEffect(() => {
  //     console.log("Updated Data Emissione:", dataEmissione);
  // }, [dataEmissione]);

  useEffect(() => {
    if (selectedCliente) {
      const filtered = ddts.filter((ddt : any) => ddt.destinatario?._id === selectedCliente._id);
      console.log(filtered)
      setFilteredDdts(filtered);
    }
    console.log(filteredDdts)

  }, [selectedCliente, ddts]);

  const handlePrezzoPerKgChange = (id: string, prezzo: number) => {
    setPrezziPerKg(prev => ({ ...prev, [id]: prezzo }));
  };

  const calcolaPrezzoTotale = (bene : any) => {
    const prezzo = prezziPerKg[bene._id] || 0;
    return bene.kg * prezzo;
  };

  
  const beniSelezionati = ddts
    .filter((ddt : any)=> selectedItems.has(ddt.id))
    .flatMap((ddt : any) => ddt.beni)
    .map((bene : any) => ({
      ...bene,
      prezzoTotale: bene.kg * calcolaPrezzoTotale(bene)
  }));

  const aggiornaPrezzoTotaleComplessivo = () => {
    const totale = beniSelezionati.reduce((acc : any, bene : any) => acc + calcolaPrezzoTotale(bene), 0);
    setPrezzoTotaleComplessivo(totale);
  };

  useEffect(() => {
    aggiornaPrezzoTotaleComplessivo();
  }, [prezziPerKg, selectedItems]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevenire il comportamento di submit predefinito

    setValue('totale', prezzoTotaleComplessivo.toFixed(2));
    setValue('scadenza', dataScadenza.toISOString().substr(0, 10));

    const idDdtSelezionati = ddts
      .filter((ddt : any) => selectedItems.has(ddt.id))
      .map((ddt : any) => ddt._id);

    setValue('allDdt', idDdtSelezionati);

    const coppieChiaveValore = Object.entries(prezziPerKg).map(([id, kg]) => ({ id, kg }));

    setValue("idKg", coppieChiaveValore)

    handleSubmit(onFinishHandler)(); // Chiamare handleSubmit passando la funzione onSubmit
  };

  return (
    <>
      <Typography fontSize={25} fontWeight={700} color="#11142d" textAlign="center">
        {type} una Fattura
      </Typography>
      <Box display="flex" justifyContent="center" mt={2.5}>
        <Card square sx={{ width: "60%", overflow: "auto" }}>
          <CardContent>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "20px",
              }}
              onSubmit={handleFormSubmit}
            >
              <Stack direction="row" alignItems="center" gap={4}>
                <FormControl fullWidth>
                  <TextField
                    label="Id"
                    required
                    color="info"
                    variant="outlined"
                    {...register("id", { required: true })}
                  />
                </FormControl>
                <FormControl fullWidth>
                    <TextField
                        id="date"
                        label="Data Emissione"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value = {dataEmissione ? dataEmissione.toISOString().substr(0, 10) : ''}
                        onChange={handleDataEmissione}
                        {...register("data", { required: true })}
                    />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id="date Scandenza"
                    label="Data Scadenza"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={dataScadenza ? dataScadenza.toISOString().substr(0, 10) : ''}
                    {...register("scadenza", { required: false })}
                  />
                </FormControl>
              </Stack>

              <FormControl fullWidth>
                <TextareaAutosize
                  minRows={5}
                  placeholder="Scrivi note"
                  style={{
                    width: "100%",
                    background: "transparent",
                    fontSize: "16px",
                    borderColor: "rgba(0,0,0,0.23)",
                    borderRadius: "4px",
                    padding: "16px",
                    color: "#919191",
                  }}
                  {...register("note", { required: false })}
                />
              </FormControl>

              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                <FormControl fullWidth>
                  <TextField
                    label="Totale €"
                    required
                    color="info"
                    variant="outlined"
                    type="number"
                    value={prezzoTotaleComplessivo.toFixed(2)}
                    {...register("totale", { required: true })}
                  />
                </FormControl>

                <Autocomplete
                  disablePortal
                  options={nomi}
                  sx={{ width: "100%" }}
                  onChange={handleClienteChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cliente"
                      color="info"
                      variant="outlined"
                      {...register("cliente", { required: true })}
                    />
                  )}
                />
              </Stack>

              <Box mt={2} display="flex" justifyContent="space-between">

                {selectedCliente &&(
                  <CustomButton
                    type="button"
                    title="Visualizza Dettagli"
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    handleClick={() => setModalOpen(true)}
                  />
                )}
                

                <CustomButton
                  type="submit"
                  title={formLoading ? "Submitting..." : "Submit"}
                  backgroundColor="#475be8"
                  color="#fcfcfc"
                />
              </Box>
            </form>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Colore</TableCell>
                  <TableCell>Codice</TableCell>
                  <TableCell>Kg</TableCell>
                  <TableCell>€ al Kg</TableCell>
                  <TableCell>Prezzo Totale</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beniSelezionati.map((bene : any , index : number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Stack direction="row" gap={1}>
                        <Card color={`#${bene.colore?.hex}`} 
                        sx={{height:"20px", 
                            width:"20px", 
                            backgroundColor:`${bene.colore?.hex}`}}/>
                        {bene.colore?.name}  
                      </Stack>
                    </TableCell>
                    <TableCell>{bene.lotto?.name}/{bene.colore?.codice}</TableCell>
                    <TableCell>{bene.kg}</TableCell>
                    <TableCell>
                      <TextField
                        id={`prezzo-per-kg-${bene._id}`}
                        type="number"
                        value={prezziPerKg[bene._id] || 0}
                        onChange={(e) => handlePrezzoPerKgChange(bene._id, parseFloat(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>{calcolaPrezzoTotale(bene).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>

      

      <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Aggiungi Ddts
                    <IconButton onClick={handleClose} color="primary" sx={{float:"right"}}><CloseIcon/>
                    </IconButton>
                </Typography>

                <Table sx={{ width: "100%" }}>
                    <TableBody>
                    {filteredDdts.length === 0 ? (
                      <Typography>Nessun DDT corrispondente trovato per il cliente selezionato.</Typography>
                    ) : (
                      filteredDdts.map((ddt : any) => (
                        <ExpandableRow 
                            key={ddt._id} 
                            id={ddt.id} 
                            beni={ddt.beni}
                            onCheck={handleCheck} 
                            isChecked={isChecked} />
                      ))
                    )}
                    </TableBody>
                </Table>
            </Box>
      </Modal>
    </>
  );
};

const ExpandableRow = ( {id, beni , onCheck , isChecked} : app ) => {
    const [open, setOpen] = useState(false);
  
    const totalKg = beni.reduce((sum, current) => sum + (current.kg as number), 0);
    const totalN = beni.reduce((sum, current) => sum + (current.n as number), 0);
  
    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            DDT N° {id} - {totalKg}Kg - Balle: {totalN}
          </TableCell>
          <TableCell padding="checkbox">
            <Checkbox
              checked={isChecked(id)}
              onChange={(event) => onCheck(id, event.target.checked)}
            />
          </TableCell>
          
        </TableRow>
        {open && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Colore</TableCell>
                    <TableCell>Codice</TableCell>
                    <TableCell align="right">Lotto</TableCell>
                    <TableCell align="right">Kg</TableCell>
                    <TableCell align="right">N</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {beni?.map((bene : any, index : number) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {bene.colore?.name}
                      </TableCell>
                      <TableCell>{bene.colore?.hex}</TableCell>
                      <TableCell align="right">{bene.lotto.name}/{bene.colore?.codice}</TableCell>
                      <TableCell align="right">{bene.kg}</TableCell>
                      <TableCell align="right">{bene.n}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

export default FatturaForm;
