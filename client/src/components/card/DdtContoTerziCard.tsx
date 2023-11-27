import { Button, Card, CardActionArea, CardContent, Typography, Box, Stack, TextField, IconButton, Grid, Autocomplete} from '@mui/material'
import PieChart from 'components/charts/PieCharts'
import { lottoCardProps } from 'interfaces/lotto'
import React from 'react'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../../utils/CartContext';
import { getId } from 'pages/ddt/idgenerator';

interface CashmereItem {
  colore: string;
  hex?: string;
  lotto?: string;
  kg: number;
  n?: number;
}

const DdtContoTerziCard = ({navigazione, name, lottoid, data, cashmere, lavorata, stats, contoterzi, venditacheck, colori ,vendita, ids} : lottoCardProps) => {
    if(venditacheck) {

      cashmere = stats.lavorata.map((item: any) => ({
        ...item, // operatore spread per copiare tutte le proprietà esistenti
        scarto: item.scarto.toFixed(2),
        kg: +((item.kg - item.scarto) || 0).toFixed(2) // Sottrai scarto da kg e limita a due cifre decimali
    }));
      
    }else{
      cashmere = contoterzi ? stats.cashmere : cashmere
      console.log(cashmere)
    }

    const {addToCart, removeFromCart,cart} = useCart();

    const [inputValues, setInputValues] =  useState(cashmere.map(() => ''));
    const [remainingQuantities, setRemainingQuantities] =  useState(cashmere.map((cash) => cash.kg)); // Stato per la quantità rimasta
    const [balleInputValues, setBalleInputValues] = useState(cashmere.map(() => ''));
    const [remainingBalle, setRemainingBalle] = useState(cashmere.map((cash) => cash.n));
    const [selectedColor, setSelectedColor] = useState(null);

    const handleColorChange = (event : any, value : any) => {
        setSelectedColor(value);
    };

    const handleBalleInputChange = (event: any, index: number) => {
      const newBalleInputValues = [...balleInputValues];
      newBalleInputValues[index] = event.target.value;
      setBalleInputValues(newBalleInputValues);
    };

    const handleInputChange = (event : any, index: number) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = event.target.value;
        setInputValues(newInputValues);
    };

    const dataFormat : string = new Date(data).toLocaleDateString()

    const handleAddToCart = (index: number) => {
      const inputValue = parseFloat(inputValues[index]);
      const balleValue = parseInt(balleInputValues[index]);
    
      // Check for valid 'balle' input
      if ((!isNaN(balleValue) && balleValue >= 1 && balleValue <= remainingBalle[index]) &&
          (!isNaN(inputValue) && inputValue >= 1 && inputValue <= remainingQuantities[index])) {
        let finalKgToAdd = inputValue;
    
        // If 'balle' equals 'n', add all remaining kilograms
        if (balleValue === remainingBalle[index]) {
          finalKgToAdd = remainingQuantities[index];
        } else if (isNaN(inputValue) || inputValue <= 0 || inputValue > remainingQuantities[index]) {
          console.error('Invalid kg input');
          return;
        }
    
        // Update or add the item in the cart
        const existingCartItemIndex = cart.findIndex((item) => 
          item.lotto === lottoid && item.colore === cashmere[index].colore
        );
    
        if (existingCartItemIndex !== -1) {
          // Existing item found in cart, remove it and add an updated version
          const existingCartItem = cart[existingCartItemIndex];
          removeFromCart(existingCartItem);
    
          const updatedItem = {
            ...existingCartItem,
            kg: existingCartItem.kg + finalKgToAdd,
            n: existingCartItem.n + balleValue
          };
          addToCart(updatedItem);
        } else {
          // No existing item found, add as a new item
          const uniqueId = getId();
          const itemToAddToCart = {
            idcart: uniqueId,
            lottoname: name,
            lotto: lottoid,
            colore: cashmere[index].colore,
            hex: cashmere[index].hex,
            kg: finalKgToAdd,
            n: balleValue
          };
          addToCart(itemToAddToCart);
        }
    
        // Update remaining quantity and reset input fields
        setRemainingQuantities(prevQuantities => {
          const newQuantities = [...prevQuantities];
          const updatedQuantity = parseFloat((newQuantities[index] - finalKgToAdd).toFixed(2));
          newQuantities[index] = updatedQuantity;
          return newQuantities;
      });
        setInputValues(prevInputValues => {
          const newInputValues = [...prevInputValues];
          newInputValues[index] = '';
          return newInputValues;
        });
        setBalleInputValues(prevBalleValues => {
          const newBalleValues = [...prevBalleValues];
          newBalleValues[index] = '';
          return newBalleValues;
        });
      } else {
        console.error('Invalid balle input');
      }
    };
    
    
    // Funzione modificata per calcolare le quantità rimanenti in base al carrello attuale
    useEffect(() => {
      // Crea una copia delle quantità originali
      const remainingQuantitiesCopy = [...cashmere.map((cash) => cash.kg)];
      const remainingBalleCopy = [...cashmere.map((cash) => cash.n)];

      cart.forEach((item) => {
        if (item.lotto === lottoid) {
          const cashIndex = cashmere.findIndex((cash) => cash.colore === item.colore);
          if (cashIndex !== -1) {
            remainingQuantitiesCopy[cashIndex] -= item.kg;
            if (remainingBalleCopy[cashIndex] != null) { // Additional check if 'n' is optional
              remainingBalleCopy[cashIndex] -= item.n;
            }
          }
        }
      });

      setRemainingQuantities(remainingQuantitiesCopy);
      setRemainingBalle(remainingBalleCopy);
      console.log(remainingBalle)
    }, [cart, cashmere, lottoid]); // Aggiungi lottoid come dipendenza
      

    // useEffect(() => {
    //     console.log('Contenuto del carrello:', cart);
    //   }, [cart]);



    return (
      <Card 
          sx={{
          width: "45%",
          height: "auto",
          borderRadius: "12px",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.02)", // Lighter box shadow on hover
          },
        }}>
          <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                  {name}
              </Typography>

              <Typography gutterBottom variant="body2" color="text.secondary">
                  Arrivato il: {dataFormat}
              </Typography>

              <Box>
              {cashmere.map((cash, index) => {
                  let hex = cash.hex == null ? "ffffff": cash.hex 
                  return(
                  <Stack alignItems="center" direction="row" gap={3}>

                          <Grid container alignItems="center" justifyContent="flex-start"> {/* Contenitore della griglia per allineamento */}
                              <Grid item>
                                  <Stack alignItems="center" direction="row" gap={1} >
                                      <Typography gutterBottom variant='body2' fontWeight="bold">Cashmere {remainingQuantities[index]} Kg </Typography>
                                      <Card color={`#${hex}`} 
                                          sx={{maxHeight:"20px", 
                                              maxWidth:"20px", 
                                              minHeight:"20px", 
                                              minWidth:"20px", 
                                              backgroundColor:`${hex}`}}/>
                                      <Typography gutterBottom variant='body2'>{cash.colore}</Typography>
                                      <Typography gutterBottom variant='body2' fontWeight="bold">Balle {remainingBalle[index]} </Typography>
                                  </Stack>
                              </Grid>
                          
                          </Grid>
                      
                          
                          <Grid container alignItems="center" justifyContent="flex-end" spacing={1}> {/* Contenitore della griglia per allineamento */}
                              <Grid item>
                                  <TextField
                                      sx={{width:"100px"}}
                                      id={`kg-${index}`}
                                      inputProps={{
                                          min: 0,
                                          max: remainingQuantities[index],
                                          type: "number"
                                      }}
                                      label="Kg"
                                      variant="standard"
                                      value={inputValues[index]} // Usa il valore corrispondente nell'array
                                      onChange={(event) => handleInputChange(event, index)} // Passa l'indice
                                  />
                              </Grid>
                              <Grid item>
                                <TextField
                                    sx={{ width: "60px" }}
                                    id={`balle-${index}`}
                                    inputProps={{ min: 1, type: "number", max: remainingBalle[index]}}
                                    label="Balle"
                                    variant="standard"
                                    value={balleInputValues[index]}
                                    onChange={(event) => handleBalleInputChange(event, index)}
                                  />
                              </Grid>
                              <Grid item>
                                  <IconButton color="primary" onClick={() => handleAddToCart(index)}>
                                  <AddIcon />
                                  </IconButton>
                              </Grid>
                          </Grid>
                  </Stack>

                  
                  
              )})}

                <Autocomplete
                    options={colori}
                    getOptionLabel={(option) => `${option.name} (${option.codice})`}
                    onChange={handleColorChange}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <Card
                                sx={{
                                    backgroundColor: option.hex,
                                    maxHeight: "20px",
                                    maxWidth: "20px",
                                    minHeight: "20px",
                                    minWidth: "20px",
                                    marginRight: "10px"
                                }}
                            />
                            <span style={{ color: 'black' }}>{option.name} </span>
                            <span style={{ color: 'darkgray' }}> {`   ${option.codice}`}</span>
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Color" variant="standard" />
                    )}
                    style={{ width: 200 }}
                />

              </Box>
          </CardContent>
      </Card>
  )
}

export default DdtContoTerziCard