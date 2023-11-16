import { Box, Grid, Stack, Typography } from "@mui/material"
import { useList } from "@refinedev/core";
import { BarCharts, PieChart } from "components"
import DonutChart from "components/charts/DonutCharts";
import FattureDeadline from "components/charts/FattureDeadline";
import LineChart from "components/charts/LineChart";
import PropertyReferrals from "components/charts/PropertyRefferals";
import ReveneuChart from "components/charts/ReveneuChart";
import { useEffect, useState } from "react";

type Totals = {
    _id: any; // o il tipo appropriato per _id
    totalCashmere: number;
    totalDaLavorare: number;
    totalLavorata: number;
    totalVenduta: number;

};

type PaymentData = {
    month: number;
    totalPayments: number;
};

const GetLotti = () => {
    const { data } = useList({ resource: "lotti" });

    const allLotti = data?.data ?? [];

    return allLotti
}

const GetTotals = (): Totals[] => {
    const { data } = useList({ resource: "lotti/totals" });

    const totals = data?.data as Totals[] ?? [];

    return totals
}

const GetYearPayments = () => {
    const { data } = useList({ resource: "pagamenti/year" });

    const allYearPayments = data?.data ?? [];

    return allYearPayments
}

const Dashboard = () => {

    const [totals, setTotals] = useState<Totals | null>(null);
    const [datiPagamenti, setDatiPagamenti] = useState<PaymentData[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // Utilizza i hook per recuperare i dati
    const totaliLotti = GetTotals();
    const pagamentiAnno = GetYearPayments();

    useEffect(() => {
        // Verifica se i dati sono stati caricati
        if (totaliLotti.length > 0 && pagamentiAnno.length > 0 && isDataLoading) {
            setTotals(totaliLotti[0]);
            const paymentData = pagamentiAnno.map(p => ({
                month: p.month,
                totalPayments: p.totalPayments
            }));
            setDatiPagamenti(paymentData);
            setIsDataLoading(false); // Imposta il caricamento dati come completato
        }
    }, [totaliLotti, pagamentiAnno, isDataLoading]);

    console.log(pagamentiAnno)

    const pagamentiSeries = [0,0,0,0,0,0,0,0,0,0,0,0]
    // Calcoli basati sui dati ottenuti
    let totaleKg = (totals?.totalCashmere || 0) + 
               (totals?.totalDaLavorare || 0) + 
               (totals?.totalLavorata || 0) + 
               (totals?.totalVenduta || 0);


    if(datiPagamenti.length > 0 ){
        for(const pagamento of datiPagamenti){
            pagamentiSeries[pagamento.month - 1] =  pagamento.totalPayments;
        }
    }


    let title = "prova";

    console.log(totals);

    let nonLavoratacolori = ["#5465ff","#bfd7ff"];
    let seriesNonLavorata = [totals?.totalCashmere || 0, totaleKg - (totals?.totalCashmere || 0)];
    let labelNonLavorata = ["In Magazzino", "Totale"];

    let InLavorazionecolori = ["#ac54ff","#cebfff"];
    let seriesInLavorazione = [totals?.totalDaLavorare || 0, totaleKg - (totals?.totalDaLavorare || 0)];
    let labelInLavorazione = ["Al Contoterzi", "Totale"];

    let Lavoratacolori = ["#ff5457","#ffbfd2"];
    let seriesLavorata = [totals?.totalLavorata || 0, totaleKg - (totals?.totalLavorata || 0)];
    let labelLavorata = ["Lavorata", "Totale"];

    let Vendutacolori = ["#FCB41C","#FCF4C4"];
    let seriesVenduta = [totals?.totalVenduta || 0, totaleKg - (totals?.totalVenduta || 0)];
    let labelVenduta = ["Venduta", "Totale"];
    

    const cashTot = pagamentiSeries.reduce((acc, curr) => acc + curr, 0)

    let vendutaLabels = ["Venduta"]
    return (
        <>

            <Box>
                <Typography fontSize={25} fontWeight={700} sx={{ color: (theme) => theme.palette.mode === 'dark' ?  '#fff' : '#1A2027' }}>
                    Dashboard
                </Typography>

                <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
                    
                    <DonutChart
                        title="Merce Non Lavorata"
                        value = {totals?.totalCashmere || 0}
                        type="Kg"
                        colors={nonLavoratacolori}
                        series={seriesNonLavorata}
                        labels={labelNonLavorata}
                        /> 
                    <DonutChart
                        title="Merce al Contoterzi"
                        value = {totals?.totalDaLavorare || 0}
                        type="Kg"
                        colors={InLavorazionecolori}
                        series={seriesInLavorazione}
                        labels={labelInLavorazione}
                        />
                    <DonutChart
                        title="Merce Lavorata"
                        value = {totals?.totalLavorata || 0}
                        type="Kg"
                        colors={Lavoratacolori}
                        series={seriesLavorata}
                        labels={labelLavorata}
                    />
                    <DonutChart
                        title="Merce Venduta"
                        value = {totals?.totalVenduta || 0}
                        type="Kg"
                        colors={Vendutacolori}
                        series={seriesVenduta}
                        labels={labelVenduta}
                    /> 

                            
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

export default Dashboard