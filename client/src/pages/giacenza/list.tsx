import React, { useMemo, useState } from 'react'
import { useTable, useList } from "@refinedev/core";
import GiacenzaCard from 'components/card/GiacenzaCard';
import { Box, Skeleton, Stack, TextField, Typography } from '@mui/material';
import CustomButton from 'components/common/CustomBotton';
import GiacenzaBarChart from 'components/charts/GiacenzaBarChart';


const GiacenzaList = () => {

    const { data, isLoading, isError } = useList({ resource: `lavorata/giacenza` });
    const Giacenza = data?.data ?? [];

    // Stati per l'ordinamento
    const [orderDatauscita, setOrderDatauscita] = useState('asc');
    const [orderDdtuscita, setOrderDdtuscita] = useState('asc');

    // Stato per la ricerca
    const [searchTerm, setSearchTerm] = useState('');

    // Ordina e filtra i dati
    const filteredAndSortedData = useMemo(() => {
        let result = [...Giacenza];
    
        // Convert searchTerm to lowercase for case-insensitive comparison
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
        // Apply the filter
        if (searchTerm) {
            result = result.filter(item =>
                item.codice.toLowerCase().includes(lowerCaseSearchTerm) || 
                (item.colorInfo && item.colorInfo.name.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }
    
        // Apply sorting for datauscita
        if (orderDatauscita) {
            result.sort((a, b) => {
                    // Safely access ddtuscita and use a default value if it's undefined
                    const kgA = a?.totalKg ?? 0; // If totalKg is undefined, use 0
                    const kgB = b?.totalKg ?? 0; // If totalKg is undefined, use 0
                    console.log(kgA,kgB,"qw")

                    // Numeric comparison
                    if (kgA < kgB) {
                        return orderDdtuscita === 'asc' ? -1 : 1;
                    }
                    if (kgA > kgB) {
                        return orderDdtuscita === 'asc' ? 1 : -1;
                    }
                    return 0;
            });
        }
    
        // Apply sorting for ddtuscita
        if (orderDdtuscita) {
            result.sort((a, b) => {
                // Safely access ddtuscita and use a default value if it's undefined
                const ddtA = (a.codice || "").toUpperCase(); // Default to an empty string if undefined
                const ddtB = (b.codice || "").toUpperCase(); // Default to an empty string if undefined
                
                if (ddtA < ddtB) {
                    return orderDdtuscita === 'asc' ? -1 : 1;
                }
                if (ddtA > ddtB) {
                    return orderDdtuscita === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
    
        return result;
    }, [Giacenza, searchTerm, orderDatauscita, orderDdtuscita]);

    const toggleSort = (field : any) => {
        if (field === 'datauscita') {
            setOrderDatauscita(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
        } else if (field === 'ddtuscita') {
            setOrderDdtuscita(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
        }
    };


    // Gestisci il cambiamento del termine di ricerca
    const handleSearchChange = (e : any) => {
        setSearchTerm(e.target.value);
    };


    return (
        <>
          {isLoading ? (
                // Visualizza lo skeleton durante il caricamento
                <Box>
                  <Skeleton variant="rectangular" width="100%" height={300} sx={{ marginBottom: 2 }} />
                </Box>
              ) : (
                // Visualizza i dati una volta caricati
                <GiacenzaBarChart
                    giacenza={Giacenza}
                    title={"Gheddafi"}
                    value={12}
                    type='Sugunna'/>
          )}
            <Box width="100%" mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {/* ... altro codice ... */}
                <Box
                    display="contents"
                    justifyContent="flex-end"
                    flexWrap="wrap-reverse"
                    mb={{ xs: "15px", sm: 0 }}>

                    {/* Campo di ricerca per codice o colorInfo.name */}
                    <TextField
                        variant="outlined"
                        color="info"
                        placeholder="Cerca per Codice o Colore"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />

                    {/* Bottone per ordinare per datauscita */}
                    <CustomButton
                        title={`Ordina Nome ${orderDatauscita === "asc" ? "↑" : "↓"}`}
                        handleClick={() => toggleSort("datauscita")}
                        backgroundColor="#475be8"
                        color="#fcfcfc"/>

                    {/* Bottone per ordinare per ddtuscita */}
                    <CustomButton
                        title={`Ordina Codice ${orderDdtuscita === "asc" ? "↑" : "↓"}`}
                        handleClick={() => toggleSort("ddtuscita")}
                        backgroundColor="#475be8"
                        color="#fcfcfc"/>
                </Box>
            </Box>
            {isLoading ? (
              // Visualizza lo skeleton durante il caricamento
              <Box>
                <Skeleton variant="rectangular" width="100%" height={118} sx={{ marginBottom: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={118} sx={{ marginBottom: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={118} />
              </Box>
            ) : (
              // Visualizza i dati una volta caricati
              filteredAndSortedData.map((coloreItem) => (
                <GiacenzaCard item={coloreItem} key={coloreItem?.codice} />
              ))
            )}
        </>
    )
}

export default GiacenzaList