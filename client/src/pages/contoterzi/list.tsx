import React, { useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, CardHeader,MenuItem, IconButton, Checkbox, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTable, useList } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ContoTerziList = () => {
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
        setFilters
    } = useTable();

    const allContoTerzi = data?.data ?? [];

    const currentData = sorters.find(item => item.field === 'dataentrata')?.order;

    const toggleSort = (field : any) => {
        setSorters([{ field, order: currentData === 'asc' ? 'desc' : 'asc' }]);
    };

    const color = ["#54478c","#2c699a","#048ba8","#0db39e","#16db93","#83e377","#b9e769","#efea5a","#f1c453","#f29e4c"]

    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error...</Typography>;

    return (
        <Box>
            <Box gap={3} mb={2} mt={3} display="flex" width="100%">
                <Typography sx={{ float: 'left', margin: '15' }} variant="h3" fontSize={40} fontWeight={700} color="#11142d">
                    {!allContoTerzi.length ? 'Non ci sono ContoTerzi' : 'ContoTerzi'}
                </Typography>

                <Box display="contents" justifyContent="flex-end" flexWrap="wrap-reverse" mb={{ xs: '15px', sm: 0 }}>
                    <CustomButton
                        title={`Ordina per Data ${currentData === 'asc' ? '↑' : '↓'}`}
                        handleClick={() => toggleSort('dataentrata')}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                    />
                </Box>
            </Box>

            <Box mt="20px">
                {allContoTerzi.map((conto, index) => {
                    const dataFormat : string = new Date(conto?.dataentrata).toLocaleDateString()

                        return (
                            <Card key={conto._id} sx={{marginBottom: 2 }}>
                                <CardHeader
                                    sx={{
                                    bgcolor: color[index % color.length],
                                    borderRadius: "7px 7px 0 0", // Matches the Paper's borderRadius
                                    color: 'white',
                                    py: 2,
                                    }}
                                    title={`ContoTerzi ${dataFormat} DDT N° ${conto?.ddt?.id}`}
                                />
                            <CardContent>
                                <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{flex: 0.30}}>Colore</TableCell>
                                        <TableCell sx={{flex: 0.20}}>Lotto</TableCell>
                                        <TableCell sx={{flex: 0.15}} >Kg</TableCell>
                                        <TableCell sx={{flex: 0.15}}>N</TableCell>
                                    {/* More headers as needed */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {conto.beni.map((bene : any, index : any) => (
                                        <TableRow key={index}>
                                        <TableCell>
                                          <Stack direction="row" gap={1}>
                                            <Card color={`#${bene.colore?.hex}`} 
                                            sx={{height:"20px", 
                                                width:"20px", 
                                                backgroundColor:`${bene.colore?.hex}`}}/>
                                            {bene.colore?.name}  
                                          </Stack>
                                        </TableCell>
                                        <TableCell>{bene.lotto?.name}/{bene.colore?.codice}</TableCell>
                                        <TableCell>{bene.kg}</TableCell>
                                        <TableCell>
                                        </TableCell>
                                        <TableCell>{}</TableCell>
                                      </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </CardContent>
                            </Card>
                        );
                    })}
            </Box>

        </Box>
    );
};

const ExpandableRow = ( bene : any ) => {
    const [open, setOpen] = useState(false);
    console.log(bene)
    return (
      <>
        <TableRow>
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{bene.colore?.name}</TableCell>
          <TableCell>{bene.lotto?.name}</TableCell>
          <TableCell>{bene.kg}</TableCell>
          <TableCell>{bene.n}</TableCell>
          <TableCell padding="checkbox">
            <Checkbox
              checked={bene.checked}
              // Add onChange handler if needed
            />
          </TableCell>
        </TableRow>
        {open && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              {/* Additional details can be shown here */}
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

export default ContoTerziList;
