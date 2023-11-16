import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import {FormProps } from "interfaces/common";
import CustomButton from "./CustomBotton";
import { Checkbox, FormControlLabel } from "@mui/material";
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ClienteFormEdit = ({
    type,
    register,
    handleSubmit,
    onFinishHandler,
    formLoading
}: FormProps) => {
    return (
        <Box alignContent="center" justifyContent="center" display="flex">
            <Box mt={2.5} width="40%" borderRadius="15px" padding="20px">
                <Typography alignItems="center" gutterBottom fontSize={25} fontWeight={700} color="#11142d">
                    {type === "Crea" ? "Crea" : "Modifica"} un Cliente
                </Typography>
                <Card sx={{padding: "10px", borderColor: "blueviolet"}}>
                    <CardContent sx={{padding:"20px"}}>
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
                                        label="Nome"
                                        fullWidth
                                        required
                                        id="outlined-basic"
                                        color="info"
                                        variant="outlined"
                                        {...register("name", { required: true })}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        type="email"
                                        id="outlined-basic"
                                        color="info"
                                        variant="outlined"
                                        {...register("email", { required: true })}
                                    />
                                </FormControl>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Indirizzo"
                                        fullWidth
                                        required
                                        id="outlined-basic"
                                        color="info"
                                        variant="outlined"
                                        {...register("indirizzo", { required: true })}
                                    />
                                </FormControl>
                                <Stack 
                                    width="100%"
                                    direction="row"
                                    alignItems="center"
                                    gap={3}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label="CAP"
                                            fullWidth
                                            required
                                            id="outlined-basic"
                                            color="info"
                                            variant="outlined"
                                            {...register("cap", { required: true })}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Telefono"
                                            fullWidth
                                            required
                                            id="outlined-basic"
                                            color="info"
                                            variant="outlined"
                                            {...register("telefono", { required: true })}
                                        />
                                    </FormControl>
                                </Stack>
                                <FormControl fullWidth>
                                        <TextField
                                            label="Codice Fiscale"
                                            fullWidth
                                            id="outlined-basic"
                                            color="info"
                                            variant="outlined"
                                            {...register("cf" )}
                                        />
                                    </FormControl>
                                <Stack 
                                    width="100%"
                                    direction="row"
                                    alignItems="center"
                                    gap={3}>
                                    
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Partita IVA"
                                            fullWidth
                                            id="outlined-basic"
                                            color="info"
                                            variant="outlined"
                                            {...register("piva", { required: false })}
                                        />
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <TextField
                                            label="Rea"
                                            fullWidth
                                            id="outlined-basic"
                                            color="info"
                                            variant="outlined"
                                            {...register("rea", { required: false })}
                                        />
                                    </FormControl>
                                </Stack>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: '10px', mt: '20px'}}>
                                    <CustomButton
                                        type="submit"
                                        title={formLoading ? "In invio..." : "Invia"}
                                        backgroundColor="#475be8"
                                        color="#fcfcfc"
                                    />
                                </Box>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>    
            </Box>
        </Box>
    );
};

export default ClienteFormEdit;