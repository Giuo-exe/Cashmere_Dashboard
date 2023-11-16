import { useList, useTable } from "@refinedev/core";
import { Typography,Box,Stack, TextField, MenuItem, Select }from "@mui/material";
import ClientCard from "components/clientCard";
import { IResourceComponentsProps } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import React, { useMemo } from "react"

const ClienteList : React.FC<IResourceComponentsProps> = () => {
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };

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
        } = useTable({ resource: "clienti"});

        const currentName = sorters.find((item) => (item.field === "name"))?.order;

        const toggleSort = (field: string) => {
            setSorters([{ field, order: currentName === "asc" ? "desc" : "asc" }]);
        };
    
        const currentFilterValues = useMemo(() => {
            const logicalFilters = filters.flatMap((item) =>
                "field" in item ? item : []
            );
    
            return {
                name:
                    logicalFilters.find((item) => item.field === "name")?.value ||
                    "",
                
            };
        }, [filters]);

    const allClienti = data?.data ?? [];

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    return (
        <Box>

            
            <Box width="100%" mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Stack direction="column" width="100%" gap={3}>
                    <Box
                        gap={3}
                        mb={2}
                        mt={3}
                        display="flex"
                        width="100%">

                        <Typography 
                            sx={{float:"left", margin:"15", 
                            color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#1A2027',}} 
                            variant="h3" fontSize={40} fontWeight={700} color="#11142d">
                        {!allClienti.length
                            ? "Non ci sono Clienti"
                            : "Clienti"}
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
                                title={`Ordina per Nome ${
                                    currentName === "asc" ? "↑" : "↓"
                                }`}
                                handleClick={() => toggleSort("name")}
                                backgroundColor="#475be8"
                                color="#fcfcfc"/>
                        </Box>

                        <Box
                            sx={{marginLeft: "auto"}}>
                                
                            <CustomButton
                                title="Add cliente"
                                handleClick={() => navigate('/clienti/create')}
                                backgroundColor="#475be8"
                                color="#fcfcfc"
                                icon={<Add/>}/>
                            
                        </Box>
                        
                    </Box>
                </Stack>
            </Box>
            

            <Box
                mt="20px"
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    width:"100%"
                }}
            >
                {allClienti.map((cliente) => {
                    let fatture = cliente.allFatture != null ? cliente.allFatture.length : 0
                    
                    return (
                        <ClientCard
                            id={cliente._id}
                            key={cliente._id}
                            name={cliente.name}
                            email={cliente.email}
                            indirizzo={cliente.indirizzo}
                            telefono={cliente.telefono}
                            cap={cliente.cap}
                            cf={cliente.cf}
                            piva={cliente.piva}
                            contoterzi={cliente.contoterzi}
                            noOfFatture={fatture}
                        />
                    )
                })}
            </Box>
            {allClienti.length > 0 && (
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
                        defaultValue={25}
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
    );
};

export default ClienteList;