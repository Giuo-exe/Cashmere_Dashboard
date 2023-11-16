import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { Autocomplete, Button, Stack, Paper, Card, CardContent } from "@mui/material";
import { FormPagamentoProps } from "interfaces/common";
import CustomButton from "./../common/CustomBotton";
import { Controller } from "react-hook-form";

const PagamentoForm = ({
    type,
    register,
    handleSubmit,
    onFinishHandler,
    formLoading,
    rimanente,
}: FormPagamentoProps) => {

    return (
        <Box bgcolor="#fcfcfc" alignContent="center" justifyContent="center" display="flex"> 
            <Box mt={2.5} width="40%" borderRadius="15px" padding="20px" bgcolor="">
                <Typography alignItems="center" gutterBottom fontSize={25} fontWeight={700} color="#11142d">
                    {type} un Pagamento
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
                                direction="row"
                                alignItems="center"
                                gap={4}>

                                <FormControl fullWidth>
                                    <TextField
                                        label="Id"
                                        fullWidth
                                        required
                                        color="info"
                                        variant="outlined"
                                        {...register("id", { required: true })}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <TextField
                                        fullWidth
                                        id="date"
                                        label="Data Emissione"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        {...register("data", { required: true })}
                                    />
                                </FormControl>
                            </Stack>

                            <FormControl fullWidth>
                                <TextField
                                    label="Totale €"
                                    required
                                    placeholder={`Massimo ${rimanente}€`}
                                    color="info"
                                    variant="outlined"
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            max: rimanente,
                                            min: 0
                                        }
                                    }}
                                    {...register("ammount", { required: false })}
                                />
                            </FormControl>

                            <FormControl fullWidth>
                                <TextField
                                    label="Note"
                                    multiline
                                    rows={4}
                                    {...register("note", { required: false })}
                                />
                            </FormControl>

                            <Box sx={{ mt: 2 }}>
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

export default PagamentoForm;
