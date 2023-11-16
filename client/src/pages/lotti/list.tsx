import {Box, Card, CardContent, Grid, Typography,TextField,Select,MenuItem,Stack } from "@mui/material"
import { useList } from "@refinedev/core";
import { LottoCard } from "components";
import { useNavigate } from "react-router-dom";
import { useTable } from "@refinedev/core";
import { useMemo } from "react";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import { ContoTerzi, lottoCardProps } from "interfaces/lotto";
import { InputText } from 'primereact/inputtext'


const LottiList = () =>{

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

    const allLotti = data?.data ?? [];

    const LottiStats = GetStats();
    console.log(LottiStats)

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


    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
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
                            {!allLotti.length
                                ? "Non ci sono Lotti"
                                : "Lotti"}
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

                        <Box
                            sx={{marginLeft: "auto"}}>
                                
                            <CustomButton
                                title="Lotti"
                                handleClick={() => navigate("/lotti/create")}
                                backgroundColor="#475be8"
                                color="#fcfcfc"
                                icon={<Add />}
                            />
                            
                        </Box>
                        
                    </Box>
                </Stack>
            </Box>

           <Card sx={{minHeight: "1000px"}}>
                <CardContent>
                    <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3}}>
                        {allLotti?.map((lotto) => {

                            const statistica = LottiStats.find((stas) => stas._id === lotto._id)

                            const lottoLavorata = lotto.lavorata ? lotto.lavorata : 0;
                            
                            if(statistica){
                                return (
                                    <LottoCard
                                        key = {lotto._id}
                                        _id = {lotto._id}
                                        navigazione = {`./show/${lotto._id}`}
                                        name = {lotto.name}
                                        data = {lotto.data}
                                        cashmere = { lotto.cashmere}
                                        contoterzi = {true}
                                        lavorata = { lottoLavorata } 
                                        stats = {statistica}/>
                                )
                            }

                            return (
                                <LottoCard
                                    key = {lotto._id}
                                    _id = {lotto._id}
                                    navigazione = {`./show/${lotto._id}`}
                                    name = {lotto.name}
                                    data = {lotto.data}
                                    contoterzi = {false}
                                    cashmere = {lotto.cashmere}
                                    lavorata = { lottoLavorata } />
                            )
                            
                        })}
                    </Box>
                </CardContent>
            </Card>

            {allLotti.length > 0 && (
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
                                e.target.value ? Number(e.target.value) : 9,
                            )
                        }
                    >
                    {[9, 18, 27, 36, 45].map((size) => (
                        <MenuItem key={size} value={size}>
                            Show {size}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            )}
        </Box>

    ) 
}

const GetStats = () => {
    const { data, isLoading, isError } = useList({ resource: `lotti/difference` });

    const allLotti = data?.data ?? [];
    
    return allLotti;
}

export default LottiList;