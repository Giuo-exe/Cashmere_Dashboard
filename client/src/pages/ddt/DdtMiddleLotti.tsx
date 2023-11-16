import {Box, Card, CardContent, Grid, Typography,TextField,Select,MenuItem,Stack, Button } from "@mui/material"
import { useList } from "@refinedev/core";
import { LottoCard } from "components";
import { useNavigate } from "react-router-dom";
import { useTable } from "@refinedev/core";
import { useMemo,useState } from "react";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import { ContoTerzi, lottoCardProps } from "interfaces/lotto";
import { InputText } from 'primereact/inputtext'
import LottoCardMiddle from "components/card/LottoCardMiddle";
import { useCart } from "utils/CartContext";
import React, { useEffect } from 'react';

interface DdtMiddleLottiProps {
    type: string;
}

const DdtMiddleLotti = ({ type }: DdtMiddleLottiProps) => {

  const navigate = useNavigate();
  const { cart } = useCart();


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
    } = useTable({resource: "lotti/contoterzi"}); 

    const allLotti = data?.data ?? [];

    const LottiStats = GetStats();
    console.log(LottiStats)
    
    const [id, setId] = useState(0);
    const [lottiHeight, setLottiHeight] = useState(window.innerHeight);

    const currentData = sorters.find((item) => (item.field === "data"))?.order;

    useEffect(() => {
        const handleResize = () => {
            setLottiHeight(window.innerHeight * (cart.length > 0 ? 0.65 : 1));
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
    }, [cart.length]);

    const lottiContainerStyles = {
        maxHeight: `${lottiHeight}px`,
        overflowY: 'auto' as "auto",
        transition: 'max-height 0.5s ease',
        // Altri stili necessari...
    };

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

    

    const GetId = (n : number) => {

        const ids = []
    
        for(let i=0; i < n; i++){
            ids.push(id)
            setId(id+1)
        }
        return ids;
      };


    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

  return (
    <div style={lottiContainerStyles}>
            <Box>
                <Box width="100%" height="auto" mt={4} sx={{display: "flex", flexWrap: "wrap", gap: 3 }}>
                    <Stack direction="column" width="100%" gap={3}>
                        <Box gap={3} mb={2} display="flex" width="100%">
                        <Typography sx={{ float: "left", marginLeft: "15px" }} variant="h5" fontSize={44} fontWeight={700} color="#11142d">
                            {!allLotti.length ? "Non ci sono Lotti" : "Lotti"}
                        </Typography>
                        <Box display="flex" justifyContent="flex-end" flexWrap="wrap-reverse" mb={{ xs: 2, sm: 0 }} sx={{ marginLeft: "auto" }} gap={2}>
                            <TextField
                            variant="outlined"
                            color="primary"
                            placeholder="Search by title"
                            value={currentFilterValues.name}
                            onChange={(e) => {
                                setFilters([
                                {
                                    field: "name",
                                    operator: "contains",
                                    value: e.currentTarget.value ? e.currentTarget.value : undefined,
                                },
                                ]);
                            }}
                            />
                            <Button
                            variant="contained"
                            onClick={() => toggleSort("data")}
                            sx={{ backgroundColor: "#475be8", color: "#fcfcfc" }}
                            >
                            Ordina per Data {currentData === "asc" ? "↑" : "↓"}
                            </Button>
                        </Box>
                        </Box>
                    </Stack>
                    </Box>

                    <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {allLotti?.map((lotto) => {
                            const vendita = type === "vendita";
                            const statistica = LottiStats.find((stas) => stas._id === lotto._id);
                            const lottoLavorata = lotto.lavorata ? lotto.lavorata : 0;

                            if (statistica?.lavorata.length === 0 && vendita) {
                            return null;
                            }

                            const commonProps = {
                            key: lotto._id,
                            lottoid: lotto._id,
                            navigazione: `./show/${lotto._id}`,
                            name: lotto.name,
                            data: lotto.data,
                            cashmere: lotto.cashmere,
                            vendita: vendita,
                            lavorata: lottoLavorata,
                            };

                            if (statistica && vendita) {
                            return (
                                <LottoCardMiddle
                                {...commonProps}
                                venditacheck={true}
                                stats={statistica}
                                />
                            );
                            } else if (statistica && !vendita) {
                            return (
                                <LottoCardMiddle
                                {...commonProps}
                                contoterzi={true}
                                stats={statistica}
                                />
                            );
                            } else {
                            return (
                                <LottoCardMiddle
                                {...commonProps}
                                contoterzi={false}
                                />
                            );
                            }
                        })}
                        </Box>

                    
                        {allLotti.length > 0 && (
                        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
                            <CustomButton
                                title="Previous"
                                handleClick={() => setCurrent((prev) => prev - 1)}
                                backgroundColor="#475be8"
                                color="#fcfcfc"
                                disabled={!(current > 1)}
                            />
                            <Box display={{ xs: "hidden", sm: "flex" }} alignItems="center" gap="5px">
                                Page <strong>{current} of {pageCount}</strong>
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
                                color="primary"
                                displayEmpty
                                required
                                inputProps={{ "aria-label": "Without label" }}
                                defaultValue={10}
                                onChange={(e) =>
                                    setPageSize(e.target.value ? Number(e.target.value) : 10)
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
        </div>
  )
}

const GetStats = () => {
    const { data, isLoading, isError } = useList({ resource: `lotti/difference` });

    const allLotti = data?.data ?? [];
    
    return allLotti;
}



export default DdtMiddleLotti