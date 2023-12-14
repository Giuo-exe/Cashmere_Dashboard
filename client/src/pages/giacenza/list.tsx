import React, { useMemo, useState } from 'react'
import { useTable, useList } from "@refinedev/core";
import GiacenzaCard from 'components/card/GiacenzaCard';
import { Box, Skeleton, Stack, TextField, Typography } from '@mui/material';
import CustomButton from 'components/common/CustomBotton';




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
                // Convert to Date objects if they are not already
                const dateA = new Date(a.datauscita);
                const dateB = new Date(b.datauscita);
                // Subtract timestamps to get the sorting
                return orderDatauscita === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            });
        }
    
        // Apply sorting for ddtuscita
        if (orderDdtuscita) {
            result.sort((a, b) => {
                // Safely access ddtuscita and use a default value if it's undefined
                const ddtA = (a.ddtuscita || "").toUpperCase(); // Default to an empty string if undefined
                const ddtB = (b.ddtuscita || "").toUpperCase(); // Default to an empty string if undefined
                
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
                        title={`Ordina per Data ${orderDatauscita === "asc" ? "↑" : "↓"}`}
                        handleClick={() => toggleSort("datauscita")}
                        backgroundColor="#475be8"
                        color="#fcfcfc"/>

                    {/* Bottone per ordinare per ddtuscita */}
                    <CustomButton
                        title={`Ordina per DDT ${orderDdtuscita === "asc" ? "↑" : "↓"}`}
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