import { IResourceComponentsProps } from '@refinedev/core';
import React from 'react'
import { useState } from "react";
import { useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from 'react-hook-form';
import { Typography,Box,Stack, Grid }from "@mui/material";
import FatturaLottoShow from 'components/show/fatturaLottoShow';
import { useParams } from 'react-router-dom';

const LottoFatturaList : React.FC<IResourceComponentsProps> = () => {
    
    const {id} = useParams();
    const { data, isLoading, isError } = useList({ resource: "fatture" });

    const allFatture = data?.data ?? [];


    return(
        <Box color={"grey"}>
            <Typography fontSize={25} fontWeight={700} color="#11142d">
                Lista Fatture
            </Typography>

            <Box color={"white"}>
                <Grid container spacing={2}>
                    {allFatture.map((fattura, index) => {
                            if (!fattura.lotto) {
                                let nome = fattura.cliente != null ? fattura.cliente.name : "";
                                return (
                                    <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={3}>
                                        <FatturaLottoShow
                                            _id={fattura._id}
                                            name={fattura.id}
                                            totale={fattura.totale}
                                            pagamenti={fattura.allPagamenti}
                                            cliente={nome}
                                            lotto={id}
                                        />
                                    </Grid>
                                );
                            }
                            // If the lotto is set, return null or false to not render anything
                            return null;
                        }
                    )}
                </Grid>
            </Box>
        </Box>
    );
}

export default LottoFatturaList