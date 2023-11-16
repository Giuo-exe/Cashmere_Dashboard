import {Box, Card, CardContent, Grid, Typography,TextField,Select,MenuItem,Stack } from "@mui/material"
import { useList } from "@refinedev/core";
import { LottoCard } from "components";
import { useNavigate, useParams } from "react-router-dom";
import { useTable } from "@refinedev/core";
import { useMemo } from "react";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import { ContoTerzi, lottoCardProps } from "interfaces/lotto";
import DdtVenditaCardView from "components/card/DdtVenditaCardView";
import { BeniGridProps } from "interfaces/grid";


const AddDdt = () => {
    const navigate = useNavigate();
    const {cliente, idfattura} = useParams();

    console.log(cliente, idfattura)

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
    } = useTable({resource: "ddt/vendita"});

    const allDdt = data?.data ?? [];
    

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
                            {!allDdt.length
                                ? "Non ci sono DDT"
                                : "DDT"}
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

           <Card >
                <CardContent>
                    <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3}}>
                        {allDdt?.map((ddt) => {
                            const sumKG = ddt.beni
                            ? ddt.beni.reduce(
                                (acc: number, bene: BeniGridProps) => {
                                return acc + (bene.kg as number);
                                },
                                0
                            )
                            : 0;

                            const dataFormat : string = new Date(ddt.data).toLocaleDateString()

                            if(ddt.destinatario.name === cliente){
                                return (
                                    <DdtVenditaCardView
                                        id={ddt._id}
                                        key={ddt._id}
                                        data={dataFormat}
                                        kg={sumKG}
                                        destinatario={ddt.destinatario.name}
                                        beni = {ddt.beni}
                                        idfattura = {idfattura}
                                        titolo={ddt.id} />
                                )
                            }

                            
                            return null


                            
                        })}
                    </Box>
                </CardContent>
            </Card>

            {allDdt.length > 0 && (
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

export default AddDdt;