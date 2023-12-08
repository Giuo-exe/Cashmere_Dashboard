import React, { useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, 
    CardHeader,MenuItem, IconButton, Checkbox, Stack, Button, Modal, Divider, TextField, ListItem, ListItemIcon, ListItemText, List ,Grid ,Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTable, useList } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useModalForm } from '@refinedev/react-hook-form';
import { useForm } from '@refinedev/react-hook-form';

interface BeneWithKg {
    _id: string;
    kg: number;
    colore?: { hex: string; name: string; _id: string, codice: string };
    lotto?: { name: string; codice: string, _id : string };
    contoterzi?: string
    n?: number
    // Aggiungi altre proprietà necessarie qui
}

interface LavorataItem {
    colore: string;
    hex: string;
    kg: number;
    // Aggiungi qui altri campi se necessario
}

interface NewItemType {
    colore: any;
    hex: string;
    kg: number;
    lotto?: any;
    n?: number;
    beneId?: string; // Opzionale se usi la stessa interfaccia per il merge
    contoterzi?: string[]; // Opzionale per il merge
    beneIds?: string[]; // Opzionale per il merge
}

// Definire il tipo per lo stato
type AdditionalProcessingState = Record<string, BeneWithKg>;

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "70vw",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  maxHeight: 1200,
  height: "80vh",
  overflowY: "auto",
  pt: 2,
  px: 4,
  pb: 3,
  minHeight: 500
};

const ContoTerziList = () => {
    const navigate = useNavigate();

    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm();

    const {
        tableQueryResult: { data, isLoading, isError },
        current,
        setCurrent,
        setPageSize,
        pageCount,
        sorters,
        setSorters,
        filters,
        setFilters
    } = useTable();

    const allContoTerzi = data?.data ?? [];

    const currentData = sorters.find(item => item.field === 'dataentrata')?.order;

    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMergeCheckbox, setShowMergeCheckbox] = useState(false);
    const [totalKg, setTotalKg] = useState(0);
    const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
    const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
    const [selectedForAdditionalProcessing, setSelectedForAdditionalProcessing] = useState<AdditionalProcessingState>({});
    const [allSelectedStates, setAllSelectedStates] = useState<{ [key: string]: boolean }>({});
    const [lavorata, setLavorata] = useState<LavorataItem[]>([]);
    const [queryData, setQueryData] = useState({
        dataUscita: '',
        numeroDDT: '',
        lavorataJSON: '',
    });

    // Funzioni per il form

    const toggleSort = (field : any) => {
        setSorters([{ field, order: currentData === 'asc' ? 'desc' : 'asc' }]);
    };

    const handleMergeSelect = (itemId: string, kg: number, colorId: string) => {
        setSelectedForMerge((prev) => {
          const newSelected = prev.includes(itemId) 
            ? prev.filter((id) => id !== itemId) 
            : [...prev, itemId];
      
          // Se è il primo elemento selezionato, imposta il colore, altrimenti rimuovi il filtro se nessun elemento è selezionato
          if (newSelected.length === 1) {
            setSelectedColorId(colorId);
          } else if (newSelected.length === 0) {
            setSelectedColorId(null);
          }
      
          // Calcola la nuova somma totale dei kg
          const newTotalKg = newSelected.reduce((total, id) => {
            const item = allContoTerzi.flatMap(conto => conto.beni).find(bene => bene._id === id);
            return total + (item ? item.kg : 0);
          }, 0);
      
          setTotalKg(newTotalKg);
          return newSelected;
        });
    };


    const handleSelect = (itemId: string) => {
        setSelectedItems((prevItems) => {
            const newSelectedItems = prevItems.includes(itemId)
                ? prevItems.filter((item) => item !== itemId)
                : [...prevItems, itemId];
    
            // Aggiorna lo stato isAllSelected per l'oggetto in selectedForAdditionalProcessing
            if (selectedForAdditionalProcessing[itemId]) {
                setSelectedForAdditionalProcessing(prev => ({
                    ...prev,
                    [itemId]: { ...prev[itemId], isAllSelected: newSelectedItems.includes(itemId) }
                }));
            }
    
            return newSelectedItems;
        });
    };
    

    const handleToggleAllSelected = (id : string) => {
        setAllSelectedStates(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        console.log(allSelectedStates)
    };
    
    const handleRemoveItem = (id : string) => {
        setSelectedForAdditionalProcessing((prev) => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });

        
    };

    const handleAddForProcessing = (bene: any) => {
        setSelectedForAdditionalProcessing(prev => ({
            ...prev,
            [bene._id]: bene
        }));
    
        // Imposta lo stato iniziale nella allSelectedStates
        setAllSelectedStates(prev => ({
            ...prev // o true, a seconda del comportamento desiderato
        }));
    };

    const handleKgChange = (id : string, newKg : number) => {
        setSelectedForAdditionalProcessing(prev => ({
            ...prev,
            [id]: { ...prev[id], kg: newKg,  }
        }));
    };

    const handleNChange = (id : string, newN : number) => {
        setSelectedForAdditionalProcessing(prev => ({
            ...prev,
            [id]: { ...prev[id], n: newN }
        }));
    };

    // lavorata


    const handleAddToLavorata = (bene: any, isMerge = false, totalKg = 0) => {
        let newItem : NewItemType
    
        if (isMerge) {
            // Gestisci l'aggiunta durante il merge
            let mergedIds = selectedForMerge.map(id => filteredItems.find(b => b._id === id));
            let mergedContoterziIds = mergedIds.map(b => b.contoterzi);
    
            newItem = {
                colore: mergedIds[0].colore || '', // Assumi il colore del primo elemento o un default
                hex: mergedIds[0].colore?.hex || '',
                kg: totalKg, // Usa il valore fornito dal TextField
                lotto: "Merged",
                contoterzi: mergedContoterziIds, // Array di ID contoterzi
                beneIds: selectedForMerge, // Array di ID bene
            };
        } else {
            // Gestisci l'aggiunta normale
            newItem = {
                colore: bene.colore || '', 
                hex: bene.colore?.hex || '',
                kg: bene.kg,
                lotto: bene.lotto,
                n: bene.n,
                contoterzi: bene.contoterzi,
                beneId: bene._id // ID singolo di bene
            };
        }
    
        setLavorata(prev => [...prev, newItem]);
    };
    

    const handleRemoveFromLavorata = (index : number) => {
        setLavorata((prev) => prev.filter((_, i) => i !== index));
    };
    

    const filteredItems = selectedItems
    .map(itemId => allContoTerzi.flatMap(conto => 
        conto.beni.map((bene : any) => ({ 
            ...bene, 
            contoterzi: conto._id, 
            ddtId: conto.ddt?.id 
        }))
    ).find(bene => bene._id === itemId))
    .filter(item => item && (!selectedColorId || item.colore?._id === selectedColorId));
    console.log(filteredItems)


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);



    ///////////////

    // Prepara l'array lavorata come stringa JSON prima dell'invio
    const handleFormSubmit = (data : any) => {
        const submissionData = {
            ...data,
            lavorataJSON : lavorata// Include it in the submission data
        };
        console.log(submissionData, "sdasdsaddsa") 
    };

    const onSubmit = async (data : any) => {
        // Your form submission logic here

        const submissionData = {
            ...data,
            lavorata : lavorata// Include it in the submission data
        };

        console.log(submissionData, "diobon");

        // Example: POST request to your server
        await fetch('http://localhost:8080/api/v1/lavorata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });
    };




    const color = ["#54478c","#2c699a","#048ba8","#0db39e","#16db93","#83e377","#b9e769","#efea5a","#f1c453","#f29e4c"]

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
      <>
        <Box>
            <Box gap={3} mb={2} mt={3} display="flex" width="100%">
                <Typography sx={{ float: 'left', margin: '15' }} variant="h3" fontSize={40} fontWeight={700} color="#11142d">
                    {!allContoTerzi.length ? 'Non ci sono ContoTerzi' : 'ContoTerzi'}
                </Typography>

                <Box display="contents" justifyContent="flex-end" flexWrap="wrap-reverse" mb={{ xs: '15px', sm: 0 }}>
                    <CustomButton
                        title={`Ordina per Data ${currentData === 'asc' ? '↑' : '↓'}`}
                        handleClick={() => toggleSort('dataentrata')}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                    />
                </Box>

                <CustomButton
                  title="Visualizza Selezionati"
                  handleClick={openModal}
                  color='#fcfcfc'
                  backgroundColor='#83e377'
                  // ... Altre proprietà del bottone
                />
            </Box>

            <Box mt="20px">
                {allContoTerzi.map((conto, index) => {
                    const dataFormat : string = new Date(conto?.dataentrata).toLocaleDateString()

                        return (
                          <Card key={conto._id} sx={{marginBottom: 2 }}>
                            <CardHeader
                                sx={{
                                bgcolor: color[index % color.length],
                                borderRadius: "7px 7px 0 0",
                                color: 'white',
                                py: 2,
                                }}
                                title={`ContoTerzi ${dataFormat} DDT N° ${conto?.ddt?.id}`}
                            />
                            <CardContent>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{flex: 0.30}}>Colore</TableCell>
                                            <TableCell sx={{flex: 0.20}}>Lotto</TableCell>
                                            <TableCell sx={{flex: 0.15}} >Kg</TableCell>
                                            <TableCell sx={{flex: 0.15}}>Balle </TableCell>
                                            <TableCell sx={{flex: 0.20}}>Seleziona</TableCell> {/* Aggiunto header per la checkbox */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {conto.beni.map((bene : any, index : number) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                  <Stack direction="row" gap={1}>
                                                    <Card 
                                                      sx={{height:"20px", width:"20px", backgroundColor:`${bene.colore?.hex}`}}
                                                    />
                                                    {bene.colore?.name}  
                                                  </Stack>
                                                </TableCell>
                                                <TableCell>{bene.lotto?.name}/{bene.colore?.codice}</TableCell>
                                                <TableCell>{bene.kg}</TableCell>
                                                <TableCell>{bene.n}</TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedItems.includes(bene._id.toString())}
                                                        onChange={() => handleSelect(bene._id.toString())}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                          </Card>
                        );
                    })}
            </Box>
        </Box>

        <Modal 
          open={isModalOpen} 
          onClose={closeModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">

          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Beni
                <IconButton onClick={closeModal} color="primary" sx={{float:"right"}}><CloseIcon/>
                </IconButton>
            </Typography>
            <Button onClick={() => setShowMergeCheckbox(!showMergeCheckbox)}>Fondi</Button>
            <Typography>Elementi Selezionati:</Typography>
            <Box sx={{minHeight: "400"}}>
                <List >
                    {filteredItems.map((bene) => {
                        console.log(bene);
                        return bene ? (
                        <ListItem key={bene._id} divider>
                            {showMergeCheckbox && (
                            <ListItemIcon>
                                <Checkbox 
                                    checked={selectedForMerge.includes(bene._id)}
                                    onChange={() => handleMergeSelect(bene._id, bene.kg, bene?.colore?._id)}
                                />
                            </ListItemIcon>
                            )}
                            <ListItemText 
                                primary = 
                                {
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Card sx={{ height: "20px", width: "20px", backgroundColor: bene.colore?.hex }} />
                                        <span>
                                            {`${bene.colore?.name} - ${bene.lotto?.name || "Merged"}/${bene.colore?.codice || ""}, Kg: ${bene.kg}, Balle: ${bene.n}`}
                                        </span>
                                    </Box>
                                }
                            // Aggiungi qui altre informazioni se necessario
                            />
                            <Typography id="body2" variant="body2" component="h4">
                                Seleziona tutto
                            </Typography>
                            <Checkbox
                                checked={allSelectedStates[bene._id] || false}
                                onChange={() => handleToggleAllSelected(bene._id)}
                            />
                            <IconButton onClick={() => handleAddForProcessing(bene)}>
                                <AddIcon /> {/* Icona per aggiungere l'elemento */}
                            </IconButton>
                            {/* Se vuoi aggiungere icone o altri elementi alla fine di ogni riga, puoi farlo qui */}
                        </ListItem>
                        ) : null;
                    })}
                </List>
            </Box>



            <Divider />

            <Box sx={{minHeight: "400px"}}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Selezionati 
                </Typography>
                {showMergeCheckbox && (
                  <Box>
                      <Typography>Totale kg:</Typography>
                      <TextField value={totalKg} type="number" variant='standard'/>
                      <IconButton onClick={() => handleAddToLavorata(null, true, totalKg)}>
                         <AddIcon /> 
                      </IconButton>
                  </Box>
                )}
              <List>
                    {Object.values(selectedForAdditionalProcessing).map((item) => { 
                        console.log(item, allSelectedStates)
                        return (
                        <ListItem key={item._id}>
                            <ListItemText primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Card sx={{ height: "20px", width: "20px", backgroundColor: item.colore?.hex }} />
                                        <span>
                                            {`${item.colore?.name} - ${item.lotto?.name}/${item.colore?.codice}`}
                                        </span>
                                    </Box>}/> 
                                    {allSelectedStates[item._id] && <Typography color="green">Tutto</Typography>}

                            <TextField
                                type="number"
                                variant='standard'
                                value={item.kg}
                                placeholder='Kg'
                                onChange={(e) => {
                                    const newKg = Number(e.target.value);
                                    if (!isNaN(newKg)) {
                                        handleKgChange(item._id, newKg);
                                    }
                                }}
                                inputProps={{ min: 1 }}
                            />
                            <TextField
                                variant='standard'
                                type="number"
                                placeholder='Balle'
                                value={item.n || 0}  // Assicurati che 'item.n' sia definito nel tuo stato iniziale
                                onChange={(e) => {
                                    const newN = Number(e.target.value);
                                    if (!isNaN(newN)) {
                                        handleNChange(item._id, newN);
                                    }
                                }}
                                inputProps={{ min: 0 }}  // Imposta un valore minimo appropriato
                            />
                            <IconButton onClick={() => handleAddToLavorata(item)}>
                                <AddIcon /> {/* Icona per aggiungere l'elemento */}
                            </IconButton>
                            <IconButton onClick={() => handleRemoveItem(item._id)}>
                                <CloseIcon /> {/* Icona per la rimozione */}
                            </IconButton>
                        </ListItem>  
                    )})}
                </List>
            </Box>

            <Divider sx={{ my: 2 }}/>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Box sx={{ my: 2 }}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                {...register("dataUscita")}
                                label="Data Uscita"
                                type="date"
                                variant="outlined"
                                error={!!errors.dataUscita}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                {...register("ddtuscita")}
                                label="Numero DDT Ricevuto"
                                type="number"
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </Box>
                                    
                {lavorata.map((item : any, index: number) => {
                    console.log(lavorata)
                    return(
                    <Paper key={index} sx={{ p: 2, my: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Card sx={{ height: 20, width: 20, backgroundColor: item.hex }} />
                        <Typography variant="body1">
                            {`${item.colore?.name} - ${item.lotto || "Unito"}/${item.colore.codice}, Kg: ${item.kg}, Balle: ${item.n}`}
                        </Typography>
                        <IconButton onClick={() => handleRemoveFromLavorata(index)}>
                            <CloseIcon />
                        </IconButton>
                    </Paper>
                )})}

                <input
                        type="hidden"
                        name="lavorataJSON"
                        value={queryData.lavorataJSON}
                    />
                    <Button type="submit">Invia Query</Button>
                </form>
            </Box>
        </Modal>
      </>
    );
};

export default ContoTerziList;
