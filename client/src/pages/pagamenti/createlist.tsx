import { IResourceComponentsProps } from '@refinedev/core';
import React, { useMemo } from 'react'
import { useState } from "react";
import { useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from 'react-hook-form';
import PagamentiFattura from 'components/show/pagamentiFattureShow';
import { useParams } from 'react-router-dom';
import { useTable } from "@refinedev/core";
import {Box, Card, CardContent, Grid, Typography,TextField,Select,MenuItem,Stack } from "@mui/material"
import CustomButton from 'components/common/CustomBotton';




const PagamentoListCreate : React.FC<IResourceComponentsProps> = () => {
    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
    } = useForm();

    const {
        tableQueryResult: { data, isLoading, isError },
        current,
        setCurrent,
        setPageSize,
        pageCount,
        sorters,
        setSorters,
        filters,
        setFilters,
    } = useTable({ resource: "fatture/selected" });

    const allFatture = data?.data ?? [];

    const currentData = sorters.find((item) => (item.field === "data"))?.order;


    const toggleSort = (field: string) => {
        setSorters([{ field, order: currentData === "asc" ? "desc" : "asc" }]);
    };

    const currentFilterValues = useMemo(() => {
        const logicalFilters = filters.flatMap((item) =>
            "field" in item ? item : []
        );

        return {
            name:
                logicalFilters.find((item) => item.field === "name")?.value ||
                "",
            data:
                logicalFilters.find((item) => item.field === "data")
                    ?.value || "",
        };
    }, [filters]);


    const onFinishHandler =  async (data: FieldValues) => {
        await onFinish({...data});
    };

    return(
        <Box>

            <Box width="100%" mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3}}>
                <Stack direction="column" width="100%" gap={3}>
                    <Box
                        gap={3}
                        mb={2}
                        mt={3}
                        display="flex"
                        width="100%">

                        <Typography sx={{float:"left", margin:"15", color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#1A2027'}} 
                            variant={'h3'}
                            fontSize={25} 
                            fontWeight={700}>
                            {!allFatture.length
                                ? "Non ci sono Fatture"
                                : "Fatture"}
                            </Typography>

                        <Box
                            display="contents"
                            justifyContent="flex-end"
                            flexWrap="wrap-reverse"
                            mb={{ xs: "15px", sm: 0 }}>

                            <TextField
                                variant="outlined"
                                color="info"
                                placeholder="Search by title"
                                value={currentFilterValues.name}
                                onChange={(e) => {
                                    setFilters([
                                        {
                                            field: "name",
                                            operator: "contains",
                                            value: e.currentTarget.value
                                                ? e.currentTarget.value
                                                : undefined,
                                        },
                                    ]);
                                }}
                            />

                            <CustomButton
                                title={`Ordina per Data ${
                                    currentData === "asc" ? "↑" : "↓"
                                }`}
                                handleClick={() => toggleSort("data")}
                                backgroundColor="#475be8"
                                color="#fcfcfc"/>
                        
                        </Box>
                        
                    </Box>
                </Stack>
            </Box>

            <Box color={"white"}>
                <Grid container spacing={2}>
                    {allFatture.map((fattura, index) => {
                            console.log(fattura.allPagamenti)
                            let nome = fattura.cliente != null ? fattura.cliente.name : ""
                        return (
                            <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={3}>
                                <PagamentiFattura
                                    _id={fattura._id}
                                    name={fattura.id}
                                    totale={fattura.totale}
                                    pagamenti={fattura.allPagamenti}
                                    cliente={nome}
                                    />
                            </Grid>
                    )})}
                </Grid>
            </Box>
        </Box>
    );
}
export default PagamentoListCreate;