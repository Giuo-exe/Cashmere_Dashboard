import React from 'react'
import { useTable, useList } from "@refinedev/core";
import GiacenzaCard from 'components/card/GiacenzaCard';
import { Box, Skeleton } from '@mui/material';




const GiacenzaList = () => {

    const { data, isLoading, isError } = useList({ resource: `lavorata/giacenza` });

    const Giacenza  = data?.data ?? [];

    console.log(Giacenza)

    return (
        <>
            {isLoading ? (
              // Visualizza lo skeleton durante il caricamento
              <Box>
                <Skeleton variant="rectangular" width="100%" height={118} sx={{ marginBottom: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={118} sx={{ marginBottom: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={118} />
              </Box>
            ) : (
              // Visualizza i dati una volta caricati
              Giacenza.map((coloreItem) => (
                <GiacenzaCard item={coloreItem} key={coloreItem?.codice} />
              ))
            )}
        </>
    )
}

export default GiacenzaList