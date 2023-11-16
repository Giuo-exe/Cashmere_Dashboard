import Box from "@mui/material/Box";
import {Typography, Paper, Card, CardContent} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Autocomplete, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import {useState } from "react"

import { DdtProps, FormFattureProps, FormLottiProps } from "interfaces/common";
import CustomButton from "./CustomBotton";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

interface CashmereItem {
    kg: string;
    colore: string;
}

interface LottiFormProps {
    type: string;
    onSubmit: (cashmere: CashmereItem[]) => void;
    formLoading: boolean;
}

const DdtForm = ({
    type,
    register,
    handleSubmit,
    onFinishHandler,
    formLoading,
    clienti
}: DdtProps) => {

    const optionAuto = ["cane","prete"]

    const [cashmere, setCashmere] = useState<CashmereItem[]>([
        { kg: "", colore: "" },
    ]);

    const handleAddField = () => {
        setCashmere([...cashmere, { kg: "", colore: "" }]);
    };

    const handleCashmereChange = (index: number, field: keyof CashmereItem, value: string | null) => {
        const updatedCashmere = [...cashmere];
        updatedCashmere[index][field] = value || ""; // Handle null by providing a default empty string
        setCashmere(updatedCashmere);
        console.log(updatedCashmere)
    };

    return (
        
        <Box bgcolor="#fcfcfc" alignContent="center" justifyContent="center" display="flex"> 
                
                
                    <Box mt={2.5} width="40%" borderRadius="15px" padding="20px" bgcolor="">
                        <Typography  alignItems="center" gutterBottom fontSize={25} fontWeight={700} color="#11142d">
                            {type} Ddt
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
                                    onSubmit={handleSubmit(onFinishHandler)}
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
                                                    label="Balle"
                                                    fullWidth
                                                    required
                                                    id="outlined-basic"
                                                    color="info"
                                                    variant="outlined"
                                                    type="number"
                                                    {...register("balle", { required: false })}
                                                />
                                            </FormControl>
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
                                                    options={optionAuto} // Aggiungi le opzioni dell'Autocomplete
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

export default DdtForm;
