import { useTable } from '@refinedev/core';
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import {Box, Stack, TextField, Typography} from "@mui/material"
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

    </>
  )
  
}

export default ListLavorata