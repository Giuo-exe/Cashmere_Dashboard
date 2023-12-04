import React, { useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, 
    CardHeader,MenuItem, IconButton, Checkbox, Stack, Button, Modal, Divider, TextField, ListItem, ListItemIcon, ListItemText, List } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTable, useList } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

interface BeneWithKg {
    _id: string;
    kg: number;
    colore?: { hex: string; name: string; _id: string, codice: string };
    lotto?: { name: string; codice: string };
    isAllSelected: boolean
    // Aggiungi altre proprietà necessarie qui
}

// Definire il tipo per lo stato
type AdditionalProcessingState = Record<string, BeneWithKg>;

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  maxHeight: 800,
  overflowY: "auto",
  pt: 2,
  px: 4,
  pb: 3,
  minHeight: 500
};

const ContoTerziList = () => {
    const navigate = useNavigate();
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




    const toggleSort = (field : any) => {
        setSorters([{ field, order: currentData === 'asc' ? 'desc' : 'asc' }]);
    };

        const handleSelect = (itemId : string) => {
          setSelectedItems((prevItems : any) => {
              if (prevItems.includes(itemId)) {
                  return prevItems.filter((item : any) => item !== itemId);
              } else {
                  return [...prevItems, itemId];
              }
          });
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

    const toggleIsAllSelected = (id : string) => {
        setSelectedForAdditionalProcessing(prev => ({
            ...prev,
            [id]: { ...prev[id], isAllSelected: !prev[id].isAllSelected }
        }));
    };
    

    const handleAddForProcessing = (bene : any) => {
        setSelectedForAdditionalProcessing(prev => ({
            ...prev,
            [bene._id]: { ...bene, isAllSelected: false } // Imposta un valore iniziale di 1 kg
        }));
    };

    const handleKgChange = (id : string, newKg : number) => {
        setSelectedForAdditionalProcessing(prev => ({
            ...prev,
            [id]: { ...prev[id], kg: newKg,  }
        }));
    };

    const filteredItems = selectedColorId
    ? selectedItems
        .map(itemId => allContoTerzi.flatMap(conto => conto.beni).find(bene => bene._id === itemId))
        .filter(item => item && item.colore?._id === selectedColorId)
        .map(bene => ({ ...bene, isAllSelected: false }))
    : selectedItems
        .map(itemId => allContoTerzi.flatMap(conto => conto.beni).find(bene => bene._id === itemId))
        .map(bene => ({ ...bene, isAllSelected: false }));
    console.log(filteredItems)


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
                                                <TableCell>{/* Altre informazioni di bene */}</TableCell>
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
              <List>
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
                                        {`${bene.colore?.name} - ${bene.lotto?.name}/${bene.colore?.codice}, Kg: ${bene.kg}`}
                                    </span>
                                </Box>
                            }
                        // Aggiungi qui altre informazioni se necessario
                        />
                        <Checkbox
                            checked={bene.isAllSelected}
                            onChange={() => toggleIsAllSelected(bene._id)}
                        />
                        <IconButton onClick={() => handleAddForProcessing(bene)}>
                            <AddIcon /> {/* Icona per aggiungere l'elemento */}
                        </IconButton>
                        {/* Se vuoi aggiungere icone o altri elementi alla fine di ogni riga, puoi farlo qui */}
                    </ListItem>
                    ) : null;
                })}
                </List>
              <Divider />
              {showMergeCheckbox && (
                  <Box>
                      <Typography>Totale kg:</Typography>
                      <TextField value={totalKg} type="number" />
                  </Box>
              )}
              <List>
                    {Object.values(selectedForAdditionalProcessing).map((item) => { 
                        console.log(item.kg)
                        return (
                        <ListItem key={item._id}>
                            <ListItemText primary={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Card sx={{ height: "20px", width: "20px", backgroundColor: item.colore?.hex }} />
                                        <span>
                                            {`${item.colore?.name} - ${item.lotto?.name}/${item.colore?.codice}`}
                                        </span>
                                    </Box>}/> 
                                {item?.isAllSelected && <Typography color="green">Tutto</Typography>}
                            <TextField
                                type="number"
                                value={item.kg}
                                onChange={(e) => {
                                    const newKg = Number(e.target.value);
                                    if (!isNaN(newKg)) {
                                        handleKgChange(item._id, newKg);
                                    }
                                }}
                                inputProps={{ min: 1 }}
                            />
                        </ListItem>
    )})}
                </List>
              <Button onClick={closeModal}>Chiudi</Button>
          </Box>
        </Modal>
      </>
    );
};

export default ContoTerziList;
