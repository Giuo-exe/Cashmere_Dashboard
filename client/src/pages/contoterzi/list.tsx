import {Box, Card, CardContent, Grid, Typography,TextField,Select,MenuItem,Stack } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { useTable, useList } from "@refinedev/core";
import { useMemo } from "react";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import ContoTerziCard from "components/card/contoterziCard";
import { FieldValues } from "react-hook-form";




const ContoTerziList = () =>{

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

    const allContoTerzi = data?.data ?? [];
    

    const currentData = sorters.find((item) => (item.field === "dataentrata"))?.order;

    const stats = GetStats()

    const toggleSort = (field: string) => {
        setSorters([{ field, order: currentData === "asc" ? "desc" : "asc" }]);
    };

    const currentFilterValues = useMemo(() => {
        const logicalFilters = filters.flatMap((item) =>
            "field" in item ? item : []
        );

        return {
            dataentrata:
                logicalFilters.find((item) => item.field === "dataentrata")
                    ?.value || "",
        };
    }, [filters]);


   


    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box>
            <Box
                gap={3}
                mb={2}
                mt={3}
                display="flex"
                width="100%">

                    <Typography sx={{float:"left", margin:"15"}} variant="h3" fontSize={40} fontWeight={700} color="#11142d">
                    {!allContoTerzi.length
                        ? "Non ci sono ContoTerzi"
                        : "ContoTerzi"}
                    </Typography>

                    <Box
                        display="contents"
                        justifyContent="flex-end"
                        flexWrap="wrap-reverse"
                        mb={{ xs: "15px", sm: 0 }}>

                        <CustomButton
                            title={`Ordina per Data ${
                                currentData === "asc" ? "↑" : "↓"
                            }`}
                            handleClick={() => toggleSort("dataentrata")}
                            backgroundColor="#475be8"
                            color="#fcfcfc"/>
                    </Box>

                    <Box
                        sx={{marginLeft: "auto"}}>
                            
                        
                        
                    </Box>
                        
                </Box>

           <Card sx={{minHeight: "1000px"}}>
                <CardContent>
                    <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {allContoTerzi?.map((conto) => {
                           // const nomi = conto.lotto.map((lotto : lottoShowCardProps) => lotto.name);
                           const statistica = stats.find((stas) => stas._id === conto._id)

                            return (
                                <ContoTerziCard
                                    contoid = {conto._id}
                                    key = {conto._id}
                                    navigazione = {`./show/${conto._id}`}
                                    dataentrata = {conto.dataentrata}
                                    beni = {conto.beni}
                                    ddt = {conto.ddt?.id}
                                    stats = {statistica}
                                    lotti={"we"}/>
                            )
                        
                        })}
                    </Box>
                </CardContent>
            </Card>

            {allContoTerzi.length > 0 && (
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
        </Box>

    ) 
}

const GetStats = () => {
    const { data, isLoading, isError } = useList({ resource: `contoterzi/difference` });

    const allLotti = data?.data ?? [];
    
    return allLotti;
}

export default ContoTerziList;