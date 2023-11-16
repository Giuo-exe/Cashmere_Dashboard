import {Modal , Button, Box, Stack, FormControl, TextField, Grid, Typography, IconButton,Card, Divider, ListItem, List, ListItemIcon, ListItemButton, ListItemText,ListSubheader} from "@mui/material"
import CustomButton from "components/common/CustomBotton";
import { ContoProps, FormBasicProps } from "interfaces/common";
import { updateContoTerzi } from "interfaces/lotto";
import { useState,useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import { FieldValue, FieldValues } from "react-hook-form";
import DeleteIcon from '@mui/icons-material/Delete';


type CartItem = {
    beni: any;
  };

const ContoTerziForm = ({
    control,
    register,
    handleSubmit,
    onFinishHandler,
    formLoading,
    beni
} : ContoProps) => {
    const [inputValues, setInputValues] = useState(beni.map(() => ''));

    const [totalKg, setTotalKg] = useState<number>(0);
    const [dataRientro, setDataRientro] = useState<string>(""); // Start with an empty date string or a default date if you prefer
    const [remainingQuantities, setRemainingQuantities] = useState(beni.map((cash : any) => cash.kg)); // Stato per la quantità rimasta
    const [balleInputValues, setBalleInputValues] = useState(beni.map(() => '')); // New state for balle input
    const [remainingBalle, setRemainingBalle] = useState(beni.map((cash : any) => cash.n));
    const [cartItems, setCartItems] = useState([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    const handleInputChange = (event : any, index: number) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = event.target.value;
        setInputValues(newInputValues);
    };

    const handleBalleInputChange = (event: any, index: number) => {
        const newBalleInputValues = [...balleInputValues];
        newBalleInputValues[index] = event.target.value;
        setBalleInputValues(newBalleInputValues);
      };


      const handleAddToCart = (index: number, quantityKg: number, quantityBalle: number) => {
        // Ensure valid quantities before proceeding
        if (quantityKg <= 0 || quantityKg > remainingQuantities[index] || quantityBalle > remainingBalle[index] || quantityBalle <= 0) {
            console.error('Invalid input');
            return;
        }
    
        let finalKgToAdd = 0;
        let finalBalleToAdd = quantityBalle;
    
        setCart(prevCart => {
            const newCart = [...prevCart];
            const existingCartItemIndex = newCart.findIndex((item) => item.beni._id === beni[index]._id);
    
            // Se tutti i kg rimanenti vengono inseriti, aggiungi anche tutte le balle rimanenti
            if (quantityKg === remainingQuantities[index]) {
                finalKgToAdd = remainingQuantities[index];
                finalBalleToAdd = remainingBalle[index];
            } else {
                finalKgToAdd = (quantityBalle === remainingBalle[index]) ? remainingQuantities[index] : quantityKg;
            }
    
            if (existingCartItemIndex !== -1) {
                newCart[existingCartItemIndex].beni.kg += finalKgToAdd;
                newCart[existingCartItemIndex].beni.n += finalBalleToAdd;
            } else {
                const newItem = {
                    beni: {
                        ...beni[index],
                        kg: finalKgToAdd,
                        n: finalBalleToAdd,
                        scarto: totalKg / (newCart.length + 1), // Assuming you want to divide the totalKg by the new cart length
                        datauscita: dataRientro
                    }
                };
                newCart.push(newItem);
            }
    
            // Recalculate scarto for all items in the cart
            return newCart.map(item => ({
                ...item,
                beni: {
                    ...item.beni,
                    scarto: totalKg / newCart.length
                }
            }));
        });
    
        // Update remaining quantities and reset input fields
        setRemainingQuantities((prev : number[]) => prev.map((qty, idx) => idx === index ? qty - finalKgToAdd : qty));
        setRemainingBalle((prev : number[]) => prev.map((balle, idx) => idx === index ? balle - finalBalleToAdd : balle));
        setInputValues((prev : string[]) => prev.map((val, idx) => idx === index ? '' : val));
        setBalleInputValues((prev : string[]) => prev.map((val, idx) => idx === index ? '' : val));
    }


    const handleRemoveToCart = (itemToRemove: CartItem) => {
        setCart(prevCart => {
            // Remove the selected item from the cart
            const updatedCart = prevCart.filter(item => item.beni._id !== itemToRemove.beni._id);
    
            // Recalculate scarto for the remaining items in the cart
            return updatedCart.map(item => ({
                ...item,
                beni: {
                    ...item.beni,
                    scarto: totalKg / updatedCart.length // Use the length of the updated cart
                }
            }));
        });
    
        // Update the remaining quantities and balle, if necessary
        const itemIndex = beni.findIndex((bene : any) => bene._id === itemToRemove.beni._id);
        if (itemIndex !== -1) {
            setRemainingQuantities((prev : number[]) => prev.map((qty, idx) => idx === itemIndex ? qty + itemToRemove.beni.kg : qty));
            setRemainingBalle((prev : number[]) => prev.map((balle, idx) => idx === itemIndex ? balle + itemToRemove.beni.n : balle));
        }
    };
    

    const handleAddWaste = (quantity: number) => {
        setTotalKg(quantity); // This sets the totalKg state
        updateCart(quantity); // Pass the new quantity directly to the updateCart function
    }
    
    const updateCart = (newTotalKg: number) => {
        setCart(currentCart => {
            return currentCart.map(item => ({
                ...item,
                beni: {
                    ...item.beni,
                    scarto: newTotalKg / currentCart.length // Use the newTotalKg directly
                }
            }));
        });
    }
    

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        setDataRientro(selectedDate);
        updateCartWithNewDate(selectedDate); // Pass the new date directly
    };
    
    const updateCartWithNewDate = (newDate: string) => {
        setCart(currentCart => {
            return currentCart.map(item => ({
                ...item,
                beni: {
                    ...item.beni,
                    datauscita: newDate
                }
            }));
        });
    };

    const onSubmit = (data: FieldValues) => {
        const mergedData = { ...data, cart };
        const result = onFinishHandler(mergedData);
    
        if (result instanceof Promise) {
            result.then(() => {
                // Reload the page after successful submission
                window.location.reload();
            }).catch(error => {
                // Handle any errors here
                console.error("Form submission error:", error);
            });
        } else {
            // If onFinishHandler does not return a Promise, you can directly reload
            // Or handle it based on your application's logic
            window.location.reload();
        }
    };
    

      useEffect(() => {
        console.log('Carrello Aggiornato:', cart);
      }, [cart]);

    return (
        <>
            <form
                    style={{
                        marginTop: "20px",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(onSubmit)(e);
                    }}>

                        {beni.map((cash : any, index: number) => {
                            let hex = cash.hex == null ? "ffffff": cash.hex 
                            console.log(cash.hex)
                            return(
                            <Stack alignItems="center" direction="row" gap={3}>

                                    <Grid container alignItems="center" justifyContent="flex-start"> {/* Contenitore della griglia per allineamento */}
                                        <Grid item>
                                            <Stack alignItems="center" direction="row" gap={1}>
                                                <Typography gutterBottom variant='body2' fontWeight="bold">{`${cash.lottoname} -`}</Typography>
                                                <Typography gutterBottom variant='body2' fontWeight="bold">Cashmere {remainingQuantities[index]} Kg </Typography>
                                                <Card color={`#${hex}`} 
                                                    sx={{height:"20px", 
                                                        width:"20px", 
                                                        backgroundColor:`${hex}`}}/>
                                                <Typography gutterBottom variant='body2'>{cash.colore}</Typography>
                                                <Typography gutterBottom variant='body2' fontWeight="bold">Balle {remainingBalle[index]} </Typography>

                                            </Stack>
                                        </Grid>
                                    
                                    </Grid>
                                
                                    
                                    <Grid container alignItems="center" justifyContent="flex-end" spacing={2}> {/* Contenitore della griglia per allineamento */}
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
                                                label="Balle"
                                                variant="standard"
                                                type="number"
                                                inputProps={{ 
                                                    min: "0", 
                                                    max: remainingBalle[index].toString(), 
                                                    step: "1" 
                                                }}
                                                value={balleInputValues[index]}
                                                onChange={(event) => handleBalleInputChange(event, index)}
                                            />
                                        </Grid>
                                        
                                        <Grid item>
                                            <IconButton color="primary" onClick={() => handleAddToCart(
                                                index, 
                                                parseFloat(inputValues[index]), 
                                                parseInt(balleInputValues[index] || '0')
                                                )}>

                                                <AddIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                            </Stack>

                            
                            
                        )})}

                        <Stack
                            direction="row"
                            flexWrap="wrap"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}>

                            <TextField
                                label="Scarto KG"
                                required
                                id="outlined-basic"
                                color="info"
                                variant="outlined"
                                type="number"
                                value={totalKg}
                                onChange={(e) => handleAddWaste(Number(e.target.value))}
                            />

                            <FormControl>
                                <TextField
                                    id="date"
                                    label="Data Rientro"
                                    type="date"
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={dataRientro}
                                    onChange={handleDateChange}
                                />
                            </FormControl>

                        </Stack>

                        <Divider variant="middle" style={{ marginTop: '10px', marginBottom: '10px' }}/>
                        
                        <Grid item xs={8}>
                            <Stack direction="column" alignItems="flex-start" spacing={1}>
                            <nav aria-label="main mailbox folders">
                                <List  
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                    Lista Beni
                                    </ListSubheader>
                                }>
                                    {cart?.map((item : any, index : number) => {
                                        console.log(item)
                                        
                                        return(
                                        <ListItem disablePadding>
                                            <ListItemIcon>
                                            </ListItemIcon>
                                            <ListItemText 
                                                primary={
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`${item.beni.lottoname} -`}
                                                        </Typography>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`Cashmere ${item.beni.kg} kg`}
                                                        </Typography>
                                                        <Card sx={{ height: "20px", width: "20px", backgroundColor: `${item.beni.hex}` }} />
                                                        <Typography variant='body2'>
                                                            {`${item.beni.colore}`}
                                                        </Typography>
                                                        <Typography variant='body2' fontWeight="bold">
                                                            {`- Balle ${item.beni.n}`}
                                                        </Typography>

                                                        {item.beni.scarto > 0 && (
                                                            <>
                                                            <Typography variant='body2' fontWeight="bold">Scarto </Typography>
                                                            <Typography variant='body2' >
                                                            {`${parseFloat(item.beni.scarto).toFixed(2)} kg`}
                                                            </Typography>
                                                        </>
                                                        )}

                                                        {item.beni.datauscita && (
                                                            <>
                                                                <Typography variant='body2' fontWeight="bold">Data uscita </Typography>
                                                                <Typography variant='body2' >
                                                                {`${item.beni.datauscita}`}
                                                                </Typography>
                                                            </>
                                                        )}

                                                    </Stack>
                                                }
                                            />
                                            <ListItemButton sx={{width: "auto"}} onClick={() => handleRemoveToCart(item)}>
                                                <DeleteIcon />
                                            </ListItemButton>
                                        </ListItem>
                                        
                                    )})}
                                </List>
                            </nav>
                            </Stack>
                        </Grid>
                        


                        <CustomButton
                            type="submit"
                            title={formLoading ? "Submitting..." : "Submit"}
                            backgroundColor="#475be8"
                            color="#fcfcfc"
                        />
                    </form>
        </>
    )
}

export default ContoTerziForm