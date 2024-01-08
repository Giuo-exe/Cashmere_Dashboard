import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useList } from '@refinedev/core';
import TreemapChart from 'components/charts/TreemapChart';
import VendutaHistory from 'components/common/VendutaHistory';
import React, { useEffect, useMemo, useState } from 'react'

interface ColorDetails {
    _id: string;
    name: string;
    codice: string;
    hex: string;
    lotti: any[]; // You may want to define a more specific type for 'lotti' if it has a known structure.
    __v: number;
  }
  
  interface Bene {
    colore: string;
    kg: number;
    n: number;
    _id: string;
    colorDetails: ColorDetails;
  }
  
  interface Ddt {
    _id: string;
    causale: string;
    id: number;
    data: string; // or Date if you prefer to work with Date objects
    destinatario: string;
    destinazione: string;
    beni: Bene;
    tara: number;
    __v: number;
    fattura?: string; // Optional as it's not present in all DDTs
  }
  
  interface SummarizedColor {
    color: ColorDetails;
    totalKg: number;
  }
  
  interface QueryResult {
    _id: null; // Assuming this is always null as per your example
    ddts: Ddt[];
    colors: SummarizedColor[];
  }

const VendutaList = () => {

    const dateRanges = [
        { label: "Sempre", value: "all" },
        { label: "Ultimo anno", value: "lastYear" },
        { label: "Ultimi 6 mesi", value: "last6Months" },
        { label: "Ultimi 3 mesi", value: "last3Months" },
        { label: "Ultimo mese", value: "lastMonth" },
      ];

    const [selectedDateRange, setSelectedDateRange] = useState(dateRanges.find(range => range.value === "all") || dateRanges[0]);
    const [dataChart, setDataChart] = useState(null);
    // Stati per l'ordinamento
    const [allVendite, setAllVendite] = useState<QueryResult | null>(null);
    const [orderDatauscita, setOrderDatauscita] = useState('asc');
    const [orderDdtuscita, setOrderDdtuscita] = useState('asc');

    // Stato per la ricerca
    const [searchTerm, setSearchTerm] = useState('');

    const handleDateRangeChange = (event : any) => {
        const newRange = dateRanges.find(range => range.value === event.target.value);

    // Ensure 'newRange' is not undefined before updating the state.
        if (newRange) {
            setSelectedDateRange(newRange);
        } else {
            // Handle the case when 'newRange' is undefined.
            // This might mean setting it to a default value, or handling the error in some way.
            console.error("Selected range not found.");
            // For example, revert to a default state if the new range is not found
            setSelectedDateRange(dateRanges[0]);
        }
        // Update your data fetching logic here...
    };

    const GetTotals = async () => {
        const {start, finish} = calculateDateRange(selectedDateRange);
        const query = start && finish ? `?start=${start}&finish=${finish}` : "";

        try {
            // Use standard fetch method to retrieve data
            const response = await fetch(`http://localhost:8080/api/v1/ddt/venditaEColori/${query}`);
            const data = await response.json();
            return data; // This should be an array or object based on your API's response
        } catch (error) {
            console.error("Error fetching totals:", error);
            return null; // Return null or appropriate error handling
        }
    };

    console.log(allVendite)

    useEffect(() => {
        // Call GetTotals and update the state with the fetched data
        const fetchTotals = async () => {
            const fetchedTotals = await GetTotals();
            setAllVendite(fetchedTotals[0]);
        };

        fetchTotals();

        // This effect should re-run whenever selectedDateRange changes
    }, [selectedDateRange]);


    // Ordina e filtra i dati
    const filteredAndSortedData = useMemo(() => {
        let result = [...allVendite?.ddts ?? []]; //sistemo poi 
    
        // Convert searchTerm to lowercase for case-insensitive comparison
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
        // Apply the filter
        // if (searchTerm) {
        //     result = result.filter(item =>
        //         item.id.toLowerCase().includes(lowerCaseSearchTerm) 
        //         // || 
        //         // (item. && item.colorInfo.name.toLowerCase().includes(lowerCaseSearchTerm))
        //     );
        // }
    
        // Apply sorting for datauscita
        if (orderDatauscita) {
            result.sort((a, b) => {
                    // Safely access ddtuscita and use a default value if it's undefined
                    // const kgA = a?.totalKg ?? 0; // If totalKg is undefined, use 0
                    // const kgB = b?.totalKg ?? 0; // If totalKg is undefined, use 0
                    // console.log(kgA,kgB,"qw")

                    // // Numeric comparison
                    // if (kgA < kgB) {
                    //     return orderDdtuscita === 'asc' ? -1 : 1;
                    // }
                    // if (kgA > kgB) {
                    //     return orderDdtuscita === 'asc' ? 1 : -1;
                    // }
                    return 0;
            });
        }
    
        // Apply sorting for ddtuscita
        if (orderDdtuscita) {
            result.sort((a, b) => {
                // Safely access ddtuscita and use a default value if it's undefined
                // const ddtA = (a.codice || "").toUpperCase(); // Default to an empty string if undefined
                // const ddtB = (b.codice || "").toUpperCase(); // Default to an empty string if undefined
                
                // if (ddtA < ddtB) {
                //     return orderDdtuscita === 'asc' ? -1 : 1;
                // }
                // if (ddtA > ddtB) {
                //     return orderDdtuscita === 'asc' ? 1 : -1;
                // }
                return 0;
            });
        }
    
        return result;
    }, [ searchTerm, orderDatauscita, orderDdtuscita]);

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


    const extractData = (colorsData: SummarizedColor[]) =>  {
        // Initialize arrays to hold the extracted data
        const series: number[] = [];
        const colors: string[] = [];
        const categories: string[] = [];

        console.log(colorsData)
      
        // Iterate over the input array to populate the output arrays
        for (const item of colorsData) {
          series.push(item.totalKg);
          colors.push(item.color.hex);
          categories.push(`${item.color.name} ${item.color.codice}`);
        }
      
        // Return the result object
        return {
          series,
          colors,
          categories,
        };
      }


    const areChartsReady = 1 && allVendite;

    const {series,categories,colors} = extractData(allVendite?.colors || [])

    console.log( allVendite?.ddts)

  return (
    <>
         <Box>
                <Typography fontSize={25} fontWeight={700} sx={{ color: (theme) => theme.palette.mode === 'dark' ?  '#fff' : '#1A2027' }}>
                    Vendute
                </Typography>

                <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
                <FormControl fullWidth style={{ marginTop: 20, marginBottom: 20 }}>
                    <InputLabel id="date-range-select-label">Select Period</InputLabel>
                    <Select
                            labelId="date-range-select-label"
                            id="date-range-select"
                            value={selectedDateRange.value} // Use the 'value' property of the selectedDateRange state.
                            label="Select Period"
                            onChange={handleDateRangeChange}
                            >
                            {dateRanges.map((range) => (
                                <MenuItem key={range.value} value={range.value}>
                                {range.label}
                                </MenuItem>
                            ))}
                            </Select>
                </FormControl>


                {areChartsReady && (
                    <>
                        <TreemapChart
                            colors={colors}
                            series={series}
                            labels={categories}
                            type='cinese'
                            value={10}
                            title='Colore Preferito'
                        
                        />

                        <VendutaHistory
                            ddts={allVendite?.ddts || []}    
                        /> 
                    </>
                )}     

                
            </Box>
        </Box>
    </>
  )
}


const calculateDateRange = (selectedRange: any) => {
    if (!selectedRange || typeof selectedRange.value === 'undefined') {
        console.error("Invalid selected range:", selectedRange);
        return { start: null, finish: null };
    }
    const now = new Date();
    let start = null;
    let finish = null;

    switch(selectedRange.value) {
        case "lastYear":
            start = new Date(new Date().setFullYear(now.getFullYear() - 1));
            finish = now;
            break;
        case "last6Months":
            start = new Date(new Date().setMonth(now.getMonth() - 6));
            finish = now;
            break;
        case "last3Months":
            start = new Date(new Date().setMonth(now.getMonth() - 3));
            finish = now;
            break;
        case "lastMonth":
            start = new Date(new Date().setMonth(now.getMonth() - 1));
            finish = now;
            break;
        case "all":
        default:
            // Both 'start' and 'finish' remain null for "Sempre"/"all"
            break;
    }
    console.log(start, finish)

    // Format dates as "yyyy-mm-dd" strings if they're not null
    if (start) start = start.toISOString().split('T')[0];
    if (finish) finish = finish.toISOString().split('T')[0];

    return { start, finish };
};

export default VendutaList