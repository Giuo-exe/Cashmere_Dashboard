import { Button, Card, CardActionArea, CardContent, Typography, Box, Stack, TextField, IconButton, Grid, Autocomplete} from '@mui/material'
import PieChart from 'components/charts/PieCharts'
import { lottoCardProps } from 'interfaces/lotto'
import React from 'react'
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import { useCart } from '../../utils/CartContext';
import { getId } from 'pages/ddt/idgenerator';
import PolarChart from 'components/charts/PolarAreaCharts'

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
    console.log(stats)
    
  
    // const initialRemainingQuantities: number[] = stats.length > 0 ? 
    // [calculateDifference(stats)] :  // If contoterzi is true
    // cashmere.map(cash => cash.kg);  //

    const {addToCart, removeFromCart, cart} = useCart();

    const [remaining, setRemaining] = useState(calculateDifference(stats).remaining);
    const [totalDaLavorareKg, setTotalDaLavorareKg] = useState(calculateDifference(stats).totalDaLavorareKg)
    const totKg: number = (remaining + totalDaLavorareKg)


    const remainingPercentuale = (remaining * 100 / totKg ).toFixed(2) || 0
    const daLavorarePercentuale = (totalDaLavorareKg * 100 / totKg ).toFixed(2) || 0

    const [inputValues, setInputValues] =  useState(cashmere.map(() => ''));
    const [remainingQuantities, setRemainingQuantities] =  useState([remaining]); // Stato per la quantità rimasta
    const [balleInputValues, setBalleInputValues] = useState(cashmere.map(() => ''));
    const [remainingBalle, setRemainingBalle] = useState(cashmere.map((cash) => cash.n));
    const [selectedColor, setSelectedColor] = useState<ColoreProps>();




    useEffect(() => {
      // Calcola il totale dei Kg già nel carrello per questo lotto specifico
      const totalKgInCart = cart.reduce((sum, cartItem) => {
        if (cartItem.lotto === lottoid) {
          return sum + cartItem.kg; // Aggiunge il peso del cartItem al totale se appartiene al lotto corretto
        }
        return sum; // Se non appartiene al lotto, ritorna semplicemente il totale corrente
      }, 0);
    
      // Calcola le nuove quantità rimanenti sottraendo il totale nel carrello dal totale iniziale
      const newRemaining = calculateDifference(stats).remaining - totalKgInCart;
    
      // Aggiorna lo stato con le nuove quantità rimanenti
      setRemaining(newRemaining);
    
      // Qui potresti dover aggiornare anche il totalDaLavorareKg, 
      // dipende da come vuoi trattare questa logica. Se il valore totale da lavorare cambia 
      // in base agli elementi nel carrello, dovresti aggiornarlo qui.
    
      // Infine, calcola e aggiorna le percentuali per il grafico basate sui nuovi valori
      const totKg = newRemaining + calculateDifference(stats).totalDaLavorareKg;
      const remainingPercentuale = (newRemaining * 100 / totKg).toFixed(2);
      const daLavorarePercentuale = (calculateDifference(stats).totalDaLavorareKg * 100 / totKg).toFixed(2);
    
      // Assicurati che le percentuali vengano passate correttamente al componente del grafico
    
    }, [cart, stats, lottoid]);

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
        setRemainingQuantities((prevQuantities : any) => {
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
    }, [cart, cashmere, lottoid]); // Aggiungi lottoid come dipendenza
      



    useEffect(() => {
        console.log('Contenuto del carrello:', cart);
      }, [cart]);



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

              <PolarChart
                colors={["#aaa444","#dea232"]}
                labels={["In Magazzino","Mandata al Contoterzi"]}
                series={[remainingPercentuale as number, daLavorarePercentuale as number]}
                title={"Kg Rimanenti"}
                type={"Ninih"}
                RemainingValue={remaining}
                ContoterziValue={totalDaLavorareKg}

              />

           
              <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ padding: "16px" }}> 
                  {/* Seleziona Colore */}
                  <Grid item>
                    <Autocomplete
                      options={colori}
                      getOptionLabel={(option) => `${option.name} ${option.codice}`}
                      onChange={handleColorChange}
                      style={{ width: 200 }}
                      renderOption={(props, option) => (
                          <li {...props}>
                              <Card
                                  sx={{
                                      backgroundColor: option.hex,
                                      height: "20px",
                                      width: "20px",
                                      marginRight: "10px",
                                      borderRadius: "50%",  // Cerchio
                                  }}
                              />
                              <span style={{ color: 'black' }}>{`${option.name} `} </span>
                              <span style={{ color: 'darkgray' }}> {`   ${option.codice}`}</span>
                          </li>
                      )}
                      renderInput={(params) => (
                          <TextField {...params} label="Seleziona Colore" variant="outlined" sx={{ width: "100%", backgroundColor: "#fff", borderRadius: "4px" }} />
                      )}
                    />
                  </Grid>

                  {/* Input per Kg */}
                  <Grid item>
                      <TextField
                          sx={{
                            width: "100px",
                            "& .MuiInputBase-root": {
                                backgroundColor: "#fff",
                                borderRadius: "4px",
                            }
                          }}
                          id={`kg-${0}`}
                          inputProps={{
                              min: 0,
                              max: remainingQuantities[0],
                              type: "number"
                          }}
                          label="Kg"
                          variant="outlined"
                          value={inputValues[0]} // Usa il valore corrispondente nell'array
                          onChange={(event) => handleInputChange(event, 0)} // Passa l'indice
                      />
                  </Grid>

                  <Grid item>
                    <TextField
                        sx={{ 
                            width: "60px",
                            "& .MuiInputBase-root": {
                                backgroundColor: "#fff",
                                borderRadius: "4px",
                            }
                        }}
                        id={`balle-${0}`}
                        inputProps={{ min: 1, type: "number", max: remainingBalle[0]}}
                        label="Balle"
                        variant="outlined"
                        value={balleInputValues[0]}
                        onChange={(event) => handleBalleInputChange(event, 0)}
                      />
                  </Grid>

                  <Grid item>
                      <IconButton color="primary" sx={{ '&:hover': { backgroundColor: "#f0f0f0" }}} onClick={() => handleAddToCart(0)}>
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
  const cashmereKg = stats.cashmere[0]?.kg || 0;

  // Calculate the total kg in stats.daLavorare, defaulting to 0 if the array is empty
  const totalDaLavorareKg : number = stats.dalavorare?.reduce((total : any, item : any) => {
      // Ensure each item's kg is a number, defaulting to 0 if not
      console.log(item)
      const kg = item.kg || 0;
      return total + kg;
  }, 0) || 0;

  console.log(cashmereKg,totalDaLavorareKg)
  const remaining = cashmereKg - totalDaLavorareKg

  // Return the difference
  return {remaining, totalDaLavorareKg};
}

export default DdtContoTerziCard