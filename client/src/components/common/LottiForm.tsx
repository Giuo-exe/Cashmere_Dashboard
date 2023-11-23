import Box from "@mui/material/Box";
import {Typography, Paper, Card, CardContent} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Autocomplete, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import {useState } from "react"

import { FormFattureProps, FormLottiProps } from "interfaces/common";
import CustomButton from "./CustomBotton";
import { Controller, FieldValues } from "react-hook-form";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface CashmereItem {
    kg: string;
    colore: string;
    hex: string 
    n: string
}

interface LottiFormProps {
    type: string;
    onSubmit: (cashmere: CashmereItem[]) => void;
    formLoading: boolean;
}

const LottiForm = ({
    type,
    register,
    handleSubmit,
    onFinishHandler,
    formLoading,
    colori,
    control
}: FormLottiProps) => {

    let listaColori = [""]
    for(const colorii of colori){
        listaColori.push(colorii.name)
    }

    const [cashmere, setCashmere] = useState<CashmereItem[]>([
        { kg: "", colore: "" , hex: "", n: ""},
    ]);

    const handleAddField = () => {
        setCashmere([...cashmere, { kg: "", colore: "" , hex: "", n: ""}]);
    };

    const handleCashmereChange = (index: number, field: keyof CashmereItem, value: string | null) => {
        const updatedCashmere = [...cashmere];
        updatedCashmere[index][field] = value || ""; // Handle null by providing a default empty string
        if (field === "colore" && value) {
            // Se il campo modificato è "colore" e il valore non è vuoto
            // Trova il colore corrispondente nel tuo array di colori
            const selectedColore = colori.find((colore : any) => colore.name === value);
    
            if (selectedColore) {
                // Se il colore è stato trovato, aggiungi l'hex corrispondente
                updatedCashmere[index].hex = selectedColore.hex;
            }
        }
        setCashmere(updatedCashmere);
        console.log(updatedCashmere)
    };

    const onSubmit = (data: FieldValues) => {
        const updatedData = { ...data, cashmere: cashmere };
        onFinishHandler(updatedData);
      };


    return (
        
        <Box bgcolor="#fcfcfc" alignContent="center" justifyContent="center" display="flex"> 
                
                
                    <Box mt={2.5} width="40%" borderRadius="15px" padding="20px" bgcolor="">
                        <Typography  alignItems="center" gutterBottom fontSize={25} fontWeight={700} color="#11142d">
                            {type} un Lotto
                        </Typography>
                        <Card sx={{padding: "10", borderColor: "blueviolet"}}>
                            <CardContent sx={{padding:"20px", borderColor:""}}>
                                <form
                                    style={{
                                        marginTop: "20px",
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px",
                                    }}
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <Stack 
                                        direction="column"
                                        alignItems="center"
                                        gap={3}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Nome Lotto"
                                                fullWidth
                                                required
                                                id="outlined-basic"
                                                color="info"
                                                variant="outlined"
                                                {...register("name", { required: true })}
                                            />
                                        </FormControl>

                                        <Stack 
                                            width="100%"
                                            direction="row"
                                            alignItems="center"
                                            gap={3}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label="Fattura"
                                                    fullWidth
                                                    required
                                                    id="outlined-basic"
                                                    color="info"
                                                    variant="outlined"
                                                    {...register("ft", { required: true })}
                                                />
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label="Fornitore"
                                                    fullWidth
                                                    required
                                                    id="outlined-basic"
                                                    color="info"
                                                    variant="outlined"
                                                    {...register("fornitore", { required: true })}
                                                />
                                            </FormControl>
                                        </Stack>

                                        <Stack
                                            width="100%"
                                            direction="row"
                                            alignItems="center"
                                            gap={3}>
                                            <FormControl fullWidth>
                                                <TextField
                                                    fullWidth
                                                    id="date"
                                                    label="Data"
                                                    type="date"
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    {...register("data", { required: true })}
                                                />
                                            </FormControl>
                                        </Stack>
                                    </Stack>

                                    {cashmere.map((item: CashmereItem, index: number) => (
                                        <Stack
                                            width="100%"

                                            key={index}
                                            direction="column"
                                            alignItems="center"
                                            gap={1}>

                                            <Typography
                                                fontSize={12}
                                                gutterBottom
                                                variant="body2"
                                            >

                                                Maglieria N° {index + 1}
                                            </Typography>

                                            <Stack 
                                                width="100%"
                                                key={index}
                                                direction="row"
                                                alignItems="center"
                                                gap={3}
                                            >

                                            <FormControl fullWidth>
                                                <TextField
                                                    label={`Kg ${index + 1}`}
                                                    required
                                                    id={`kg-${index}`}
                                                    color="info"
                                                    variant="outlined"
                                                    type="number"
                                                    {...register(`cashmere[${index}].kg`, { required: true })}
                                                    value={item.kg}
                                                    onChange={(e) =>
                                                        handleCashmereChange(index, "kg", e.target.value)
                                                    }
                                                />
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <Autocomplete 
                                                    id={`autocomplete-${index}`}
                                                    options={listaColori} // Aggiungi le opzioni dell'Autocomplete
                                                    value={item.colore}
                                                    onChange={(_, newValue) =>
                                                        handleCashmereChange(index, "colore", newValue)
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={`Colore ${index + 1}`}
                                                            color="info"
                                                            variant="outlined"
                                                            {...register(`cashmere[${index}].colore`, { required: false })}
                                                            
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <TextField
                                                    label={`Balle ${index + 1}`}
                                                    required
                                                    id={`n-${index}`}
                                                    color="info"
                                                    variant="outlined"
                                                    type="number"
                                                    inputProps={{ min: 1 }} // Set minimum value to 1
                                                    defaultValue={1} // Set default value to 1
                                                    {...register(`cashmere[${index}].n`, { required: true })}
                                                    value={item.n}
                                                    onChange={(e) => handleCashmereChange(index, "n", e.target.value)}
                                                />
                                            </FormControl>
                                            
                                        </Stack>
                                    </Stack>
                                    
                                ))}
                                

                                <Button 
                                    sx={{float: "left"}}
                                    color="primary"
                                    onClick={handleAddField}>
                                        + Aggiungi
                                </Button>

                                <Box sx={{float: "right"}}>
                                    <CustomButton
                                        type="submit"
                                        title={formLoading ? "Submitting..." : "Submit"}
                                        backgroundColor="#475be8"
                                        color="#fcfcfc"
                                    />
                                </Box>                           
                            </form>
                        </CardContent>
                    </Card>    
                </Box>
        </Box>
    );
};

export default LottiForm;
