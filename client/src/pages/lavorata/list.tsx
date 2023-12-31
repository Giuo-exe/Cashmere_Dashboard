import { useTable } from '@refinedev/core';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {Box, MenuItem, Select, Stack, TextField, Typography} from "@mui/material"
import CustomButton from 'components/common/CustomBotton';
import { Add } from "@mui/icons-material";
import ListLavorataCard from 'components/card/ListLavorataCard';


const ListLavorata = () => {
    const navigate = useNavigate();

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
    } = useTable();

    const allLavorata = data?.data ?? [];
    console.log(allLavorata)


    const currentData = sorters.find((item) => (item.field === "datauscita"))?.order;

    const [initialSortSet, setInitialSortSet] = useState(false);

    useEffect(() => {
        if (!initialSortSet) {
            // Imposta l'ordinamento iniziale solo se non è stato già impostato
            setSorters([{ field: 'datauscita', order: 'desc' }]);
            setInitialSortSet(true); // Aggiorna la variabile di stato
        }
    }, [setSorters, initialSortSet]);


    const toggleSort = (field: string) => {
        setSorters([{ field, order: currentData === "desc" ? "asc" : "desc" }]);
    };

        // Imposta l'ordinamento iniziale a decrescente per il campo 'datauscita'

    const currentFilterValues = useMemo(() => {
        const logicalFilters = filters.flatMap((item) =>
            "field" in item ? item : []
        );

        return {
            ddt:
                logicalFilters.find((item) => item.field === "ddtuscita")?.value ||
                "",
            data:
                logicalFilters.find((item) => item.field === "datauscita")
                    ?.value || "",
        };
    }, [filters]);

    console.log(allLavorata)


    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

  return (
    <>
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
                        
                            variant="h3" 
                            fontSize={40} 
                            fontWeight={700}>
                            {!allLavorata.length
                                ? "Non c'è Merce Lavorata"
                                : "Lavorata"}
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
                                value={currentFilterValues.ddt}
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
                                handleClick={() => toggleSort("datauscita")}
                                backgroundColor="#475be8"
                                color="#fcfcfc"/>
                        </Box>
                        
                    </Box>
                </Stack>
            </Box>
        </Box>

        {allLavorata?.map((Lavorata) => {
            return(
                <>
                    <ListLavorataCard
                        data={Lavorata}>
                    </ListLavorataCard>
                </>
            )
        })}

        {allLavorata.length > 0 && (
            <Box display="flex" gap={2} mt={3} flexWrap="wrap">
                <CustomButton
                    title="Previous"
                    handleClick={() => setCurrent((prev) => prev - 1)}
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    disabled={!(current > 1)}
                />
                <Box
                    display={{ xs: "hidden", sm: "flex" }}
                    alignItems="center"
                    gap="5px"
                >
                    Page{" "}
                    <strong>
                        {current} of {pageCount}
                    </strong>
                </Box>
                <CustomButton
                    title="Next"
                    handleClick={() => setCurrent((prev) => prev + 1)}
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    disabled={current === pageCount}
                />
                <Select
                    variant="outlined"
                    color="info"
                    displayEmpty
                    required
                    inputProps={{ "aria-label": "Without label" }}
                    defaultValue={10}
                    onChange={(e) =>
                        setPageSize(
                            e.target.value ? Number(e.target.value) : 10,
                        )
                    }
                >
                {[10, 20, 30, 40, 50].map((size) => (
                    <MenuItem key={size} value={size}>
                        Show {size}
                    </MenuItem>
                ))}
                </Select>
            </Box>
        )}

    </>
  )
  
}

export default ListLavorata