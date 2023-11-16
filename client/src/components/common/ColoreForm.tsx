import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {Stack,Paper,Popover} from "@mui/material";
import { Controller } from "react-hook-form";
import {FormProps } from "interfaces/common";
import CustomButton from "./CustomBotton";

import React, { useState } from "react";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const ColoreForm = ({
    control,
    register,
    handleSubmit,
    onFinishHandler,
    formLoading
}: FormProps) => {
    const [selectedColor, setSelectedColor] = useState('#000000'); // Colore predefinito

    const handleColorChange = (event: any) => {
        const newColor = event.target.value;
        setSelectedColor(newColor);
        {register("hex", { required: false })}
        console.log("Colore selezionato:", newColor);
      };

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
                onSubmit={handleSubmit(onFinishHandler)}>
                    <Box>
                        <Stack
                            direction="column"
                            flexWrap="wrap"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={1}>
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}>

                                <Controller
                                    name="name" // Nome del campo nei dati del form
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nome Colore"
                                        required
                                        variant="outlined"
                                    />
                                    )}
                                />

                                <Controller
                                    name="codice" // Nome del campo nei dati del form
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Codice"
                                        required
                                        variant="outlined"
                                    />
                                    )}
                                />

                                
                            </Stack>

                            <Controller
                                name="hex" // Nome del campo nei dati del form
                                control={control}
                                defaultValue="#000000" // Valore predefinito
                                render={({ field }) => (
                                <TextField
                                    sx={{width:"50px"}}
                                    {...field}
                                    label="Colore"
                                    type="color"
                                    InputLabelProps={{
                                    shrink: true,
                                    }}
                                />
                                )}
                            />
                    </Stack>

                    <CustomButton
                        type="submit"
                        title={formLoading ? "Submitting..." : "Submit"}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                    />
                </Box>
            </form>
        </>
    );
};


export default ColoreForm;