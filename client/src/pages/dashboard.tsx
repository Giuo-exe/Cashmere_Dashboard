import { Calculate } from "@mui/icons-material";
import { Autocomplete, Box, FormControl, Grid, InputLabel, Select, Stack, TextField, Typography,MenuItem } from "@mui/material"
import { BaseRecord, useList } from "@refinedev/core";
import { BarCharts, PieChart } from "components"
import DonutChart from "components/charts/DonutCharts";
import FattureDeadline from "components/charts/FattureDeadline";
import LineChart from "components/charts/LineChart";
import PropertyReferrals from "components/charts/PropertyRefferals";
import ReveneuChart from "components/charts/ReveneuChart";
import { useEffect, useState } from "react";

type Totals = {
    _id: any; // o il tipo appropriato per _id
    totalCashmere: {totalKg: number};
    totalDaLavorare: {totalKg: number};
    totalLavorata: {totalKg: number};
    totalVenduta: {totalKg: number};

};

type ChartDataType = {
    nonLavorataData: { colori: string[]; series: any[]; labels: string[] };
    InLavorazioneData: { colori: string[]; series: any[]; labels: string[] };
    LavorataData: { colori: string[]; series: any[]; labels: string[] };
    VendutaData: { colori: string[]; series: any[]; labels: string[] };
};

type PaymentData = {
    month: number;
    totalPayments: number;
};

type TotalsType = [BaseRecord[], BaseRecord[], BaseRecord[], BaseRecord[]] | null;

const GetLotti = () => {
    const { data } = useList({ resource: "lotti" });

    const allLotti = data?.data ?? [];

    return allLotti
}


const Dashboard = () => {

    const [allTotals, setAllTotals] = useState<Totals | null>(null);
    const [dataChart, setDataChart] = useState<ChartDataType | null>(null);

    const [datiPagamenti, setDatiPagamenti] = useState<PaymentData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [totaliLotti, setTotaliLotti] = useState<TotalsType | null>(null);

    //const resultati = GetTotali();
   

    // Utilizza i hook per recuperare i dati
    const pagamentiAnno = GetYearPayments();

    const dateRanges = [
        { label: "Sempre", value: "all" },
        { label: "Ultimo anno", value: "lastYear" },
        { label: "Ultimi 6 mesi", value: "last6Months" },
        { label: "Ultimi 3 mesi", value: "last3Months" },
        { label: "Ultimo mese", value: "lastMonth" },
      ];

    const [selectedDateRange, setSelectedDateRange] = useState(dateRanges.find(range => range.value === "all") || dateRanges[0]);
    

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
            const response = await fetch(`http://localhost:8080/api/v1/dashboard/tot/${query}`);
            const data = await response.json();
            return data; // This should be an array or object based on your API's response
        } catch (error) {
            console.error("Error fetching totals:", error);
            return null; // Return null or appropriate error handling
        }
    };
    useEffect(() => {
        // Call GetTotals and update the state with the fetched data
        const fetchTotals = async () => {
            const fetchedTotals = await GetTotals();
            setAllTotals(fetchedTotals);
        };

        fetchTotals();

        // This effect should re-run whenever selectedDateRange changes
    }, [selectedDateRange]);

    useEffect(() => {
        // Calculate dataChart whenever totals is updated
        if (allTotals) {
            const chartData = getChartData(allTotals, 1000); // Ensure getChartData is defined correctly
            setDataChart(chartData);
        }

        const paymentData = pagamentiAnno.map(p => ({
            month: p.month,
            totalPayments: p.totalPayments
        }));
        setDatiPagamenti(paymentData);
    }, [allTotals,pagamentiAnno]);


    console.log(allTotals)

    console.log(pagamentiAnno)


    console.log(dataChart)

    const pagamentiSeries = [0,0,0,0,0,0,0,0,0,0,0,0]
    // Calcoli basati sui dati ottenuti
    // let totaleKg = (totals?.totalCashmere || 0) + 
    //            (totals?.totalDaLavorare || 0) + 
    //            (totals?.totalLavorata || 0) + 
    //            (totals?.totalVenduta || 0);


    if(datiPagamenti.length > 0 ){
        for(const pagamento of datiPagamenti){
            pagamentiSeries[pagamento.month - 1] =  pagamento.totalPayments;
        }
    }


    let title = "prova";

    const areChartsReady = dataChart && allTotals;

     let Lavoratacolori = ["#ff5457","#ffbfd2"];
    

    const cashTot = pagamentiSeries.reduce((acc, curr) => acc + curr, 0)

    let vendutaLabels = ["Venduta"]
    return (
        <>

            <Box>
                <Typography fontSize={25} fontWeight={700} sx={{ color: (theme) => theme.palette.mode === 'dark' ?  '#fff' : '#1A2027' }}>
                    Dashboard
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
                        <DonutChart
                            title="Merce Non Lavorata"
                            value = {allTotals?.totalCashmere.totalKg || 0}
                            type="Kg"
                            colors={dataChart?.nonLavorataData?.colori || ["#fffff","#ffffff"]}
                            series={dataChart?.nonLavorataData?.series || [0]}
                            labels={dataChart?.nonLavorataData?.labels || ["default label"]}
                            /> 
                        <DonutChart
                            title="Merce al Contoterzi"
                            value = {allTotals?.totalDaLavorare.totalKg || 0}
                            type="Kg"
                            colors={dataChart?.InLavorazioneData?.colori || ["#fffff","#ffffff"]}
                            series={dataChart?.InLavorazioneData?.series || [0]}
                            labels={dataChart?.InLavorazioneData?.labels || ["default label"]}
                            />
                        <DonutChart
                            title="Merce Lavorata"
                            value = {allTotals?.totalLavorata.totalKg || 0}
                            type="Kg"
                            colors={dataChart?.LavorataData?.colori || ["#fffff","#ffffff"]}
                            series={dataChart?.LavorataData?.series || [0]}
                            labels={dataChart?.LavorataData?.labels || ["default label"]}
                        />
                        <DonutChart
                            title="Merce Venduta"
                            value = {allTotals?.totalVenduta.totalKg || 0}
                            type="Kg"
                            colors={dataChart?.VendutaData?.colori || ["#fffff","#ffffff"]}
                            series={dataChart?.VendutaData?.series || [0]}
                            labels={dataChart?.VendutaData?.labels || ["default label"]}
                        /> 
                    </>
                )}
                    
                    

                            
                </Box>

                <Grid container spacing={2} sx={{marginTop: "16px"}}>
                    <Grid item xs={6}>
                        <ReveneuChart
                            title={title}
                            value = {cashTot}
                            colors={Lavoratacolori}
                            series={pagamentiSeries}
                            max= {cashTot}
                            type={"€"}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <FattureDeadline />
                    </Grid>
                </Grid>


                <Box
                    flex={1}
                    borderRadius="15px"
                    padding="20px"
                    display="flex"
                    flexDirection="column"
                    minWidth="100%"
                    mt="25px"
                    sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ?  '#1A2027': '#fff' }}
                >

                    <Box
                        mt={2.5}
                        sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}
                    >
                        
                        
                    </Box>
                </Box>
            </Box>
        </>
    )
}

function getChartData(totals : any, totaleKg : number) {
    // Define color arrays
    const nonLavoratacolori = ["#5465ff","#bfd7ff"];
    const InLavorazionecolori = ["#ac54ff","#cebfff"];
    const Lavoratacolori = ["#ff5457","#ffbfd2"];
    const Vendutacolori = ["#FCB41C","#FCF4C4"];

    const totNL = totals?.totalCashmere.totalKg || 0 - totals?.totalDaLavorare.totalKg
    const totIL = totals?.totalDaLavorare.totalKg - totals?.totalLavorata.totalKg
    const totL = totals?.totalLavorata.totalKg - totals?.totalVenduta.totalKg || 0
    const totV = totals?.totalVenduta.totalKg

    const tot = totNL + totIL + totL + totV

    // Define series arrays based on totals and totaleKg
    const seriesNonLavorata = [totNL, tot - totNL];
    const seriesInLavorazione = [totIL, tot - totIL];
    const seriesLavorata = [totL, tot - totL];
    const seriesVenduta = [totV, tot - totV];

    // Define label arrays
    const labelNonLavorata = ["In Magazzino", "Totale"];
    const labelInLavorazione = ["Al Contoterzi", "Totale"];
    const labelLavorata = ["Lavorata", "Totale"];
    const labelVenduta = ["Venduta", "Totale"];

    // Return an object containing all the data
    return {
        nonLavorataData: {
            colori: nonLavoratacolori,
            series: seriesNonLavorata,
            labels: labelNonLavorata
        },
        InLavorazioneData: {
            colori: InLavorazionecolori,
            series: seriesInLavorazione,
            labels: labelInLavorazione
        },
        LavorataData: {
            colori: Lavoratacolori,
            series: seriesLavorata,
            labels: labelLavorata
        },
        VendutaData: {
            colori: Vendutacolori,
            series: seriesVenduta,
            labels: labelVenduta
        }
    };
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

const GetTotali  = () =>  {
    const { data } = useList({ resource: `dashboard/tot/`});

    const totals = data?.data ?? [];

    return totals
}

const GetYearPayments = () => {
    const { data } = useList({ resource: "pagamenti/year" });

    const allYearPayments = data?.data ?? [];

    return allYearPayments
}

export default Dashboard