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
  colorename: string;
  hex?: string;
  lotto?: string;
  kg: number;
  n?: number;
}

interface ColoreProps {
  _id: string 
  name: string,
  codice: string,
  hex: string ;
}

const DdtContoTerziCard = ({navigazione, name, lottoid, data, cashmere, lavorata, stats, contoterzi, venditacheck, colori ,vendita, ids} : lottoCardProps) => {
    
    cashmere = contoterzi ? stats.cashmere : cashmere
    console.log(stats.cashmere)
    
  
    // const initialRemainingQuantities: number[] = stats.length > 0 ? 
    // [calculateDifference(stats)] :  // If contoterzi is true
    // cashmere.map(cash => cash.kg);  //

    const initialRemainingQuantities = [calculateDifference(stats)]

    console.log(initialRemainingQuantities)

    const {addToCart, removeFromCart, cart} = useCart();

    const [inputValues, setInputValues] =  useState(cashmere.map(() => ''));
    const [remainingQuantities, setRemainingQuantities] =  useState(initialRemainingQuantities); // Stato per la quantità rimasta
    const [balleInputValues, setBalleInputValues] = useState(cashmere.map(() => ''));
    const [remainingBalle, setRemainingBalle] = useState(cashmere.map((cash) => cash.n));
    const [selectedColor, setSelectedColor] = useState<ColoreProps>();

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
      if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= remainingQuantities[index]) {
        let finalKgToAdd = inputValue;
        const colorid = selectedColor?._id || ""
        const colore = selectedColor?.name || ""
        const hex = selectedColor?.hex || ""
 
        const uniqueId = getId();
        const itemToAddToCart = {
          idcart: uniqueId,
          lottoname: (name as string),
          lotto: (lottoid as string),
          colore: colorid,
          colorename: colore,
          hex,
          kg: finalKgToAdd,
          n: balleValue
        };
        addToCart(itemToAddToCart);
    
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
      }
    };
    
    
    // Funzione modificata per calcolare le quantità rimanenti in base al carrello attuale
    useEffect(() => {
      // Crea una copia delle quantità originali
      const remainingQuantitiesCopy = [...cashmere.map((cash) => cash.kg)];
      // const remainingBalleCopy = [...cashmere.map((cash) => cash.n)];

      cart.forEach((item) => {
        if (item.lotto === lottoid) {
            remainingQuantitiesCopy[0] -= item.kg;
            // if (remainingBalleCopy[cashIndex] != null) { // Additional check if 'n' is optional
            //   remainingBalleCopy[cashIndex] -= item.n;
            // }
        }
      });

      setRemainingQuantities(remainingQuantitiesCopy);
      // setRemainingBalle(remainingBalleCopy);
      console.log(remainingBalle)
    }, [cart, cashmere, lottoid]); // Aggiungi lottoid come dipendenza
      
    console.log(colori)


    useEffect(() => {
        console.log('Contenuto del carrello:', cart);
      }, [cart]);



    return (
      <Card 
          sx={{
          width: "45%",
          height: "400px",
          borderRadius: "12px",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "scale(1.02)", // Lighter box shadow on hover
          },
        }}>
          <CardContent>
              <Typography gutterBottom variant="h4" component="div">
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
                                      <Typography gutterBottom variant='body1' fontWeight="bold">Cashmere {remainingQuantities[index]} Kg </Typography>
                                      <Typography gutterBottom variant='body2' fontWeight="bold">Balle {remainingBalle[index]} </Typography>
                                  </Stack>
                              </Grid>
                          
                          </Grid>
                  </Stack>

                  
                  
              )})}

              <Grid container alignItems="center" justifyContent="flex-end" spacing={1}> {/* Contenitore della griglia per allineamento */}
                <Grid item>
                  <Autocomplete
                        options={colori}
                        getOptionLabel={(option) => `${option.name} ${option.codice}`}
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
                                <span style={{ color: 'black' }}>{`${option.name} `} </span>
                                <span style={{ color: 'darkgray' }}> {`   ${option.codice}`}</span>
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="Select Color" variant="standard" />
                        )}
                        style={{ width: 200 }}
                  />
                </Grid>
                <Grid item>
                    <TextField
                        sx={{width:"100px"}}
                        id={`kg-${0}`}
                        inputProps={{
                            min: 0,
                            max: remainingQuantities[0],
                            type: "number"
                        }}
                        label="Kg"
                        variant="standard"
                        value={inputValues[0]} // Usa il valore corrispondente nell'array
                        onChange={(event) => handleInputChange(event, 0)} // Passa l'indice
                    />
                </Grid>
                <Grid item>
                  <TextField
                      sx={{ width: "60px" }}
                      id={`balle-${0}`}
                      inputProps={{ min: 1, type: "number", max: remainingBalle[0]}}
                      label="Balle"
                      variant="standard"
                      value={balleInputValues[0]}
                      onChange={(event) => handleBalleInputChange(event, 0)}
                    />
                </Grid>
                <Grid item>
                    <IconButton color="primary" onClick={() => handleAddToCart(0)}>
                      <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>

              </Box>
          </CardContent>
      </Card>
  )
}

function calculateDifference(stats : any) {
  // Safely access stats.cashmere.kg, defaulting to 0 if not available
  const cashmereKg = stats.cashmere?.kg || 0;

  // Calculate the total kg in stats.daLavorare, defaulting to 0 if the array is empty
  const totalDaLavorareKg = stats.daLavorare?.reduce((total : any, item : any) => {
      // Ensure each item's kg is a number, defaulting to 0 if not
      const kg = item.kg || 0;
      return total + kg;
  }, 0) || 0;

  console.log(cashmereKg,totalDaLavorareKg)

  // Return the difference
  return cashmereKg - totalDaLavorareKg;
}

export default DdtContoTerziCard