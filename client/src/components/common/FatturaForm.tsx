import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Autocomplete } from "@mui/material";
import Stack from "@mui/material/Stack";
import {Card,CardContent} from "@mui/material";


import {FormFattureProps } from "interfaces/common";
import CustomButton from "./CustomBotton";
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const FatturaForm = ({
    type,
    register,
    handleSubmit,
    onFinishHandler,
    formLoading,
    clienti
}: FormFattureProps) => {
    return (   
        <>
            <Typography fontSize={25} fontWeight={700} color="#11142d" textAlign="center">
                {type} una Fattura
            </Typography>
            <Box display="flex" justifyContent="center" mt={2.5}>
                <Card sx={{ width: "40%", borderRadius: "15px", overflow: "hidden" }}>
                    <CardContent>
                        <form
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                                padding: "20px",
                            }}
                            onSubmit={handleSubmit(onFinishHandler)}
                        >

                            <Stack 
                                direction="row"
                                alignItems="center"
                                gap={4}>

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
                                        {...register("data", { required: true })}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <TextField
                                        id="date"
                                        label="Data Scadenza"
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
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

                            <Stack 
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}>

                                <FormControl fullWidth>
                                    <TextField
                                        label="Totale €"
                                        required
                                        color="info"
                                        variant="outlined"
                                        type="number"
                                        {...register("totale", { required: false })}
                                    />
                                </FormControl>

                                <Autocomplete
                                    disablePortal
                                    options={clienti}
                                    sx={{ width: "100%" }}
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

                            <Box mt={2} display="flex" justifyContent="flex-end">
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
        </>
    );
};

export default FatturaForm;