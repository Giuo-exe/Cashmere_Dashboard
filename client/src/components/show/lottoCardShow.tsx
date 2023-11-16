import { Box, Button, Card, CardActionArea, CardContent, Grid, Stack, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import BarCharts from "components/charts/BarCharts"
import BiggerPieChart from "components/charts/BiggerPieChart"
import BiggerPieLottoChart from "components/charts/BiggerPieLottoChart"
import PieChart from "components/charts/PieCharts"
import RealBarCharts from "components/charts/RealBarChart"
import columns from "components/grid/FatturaGridLotto"
import ContoTerziModal from "components/Modal/ContoTerziModal"
import { FatturaGridProps, PagamentiGridProps } from "interfaces/grid"
import { ContoTerzi, lottoShowCardProps, lottoSingle } from "interfaces/lotto"
import { useNavigate } from "react-router-dom"

interface CashmereItem {
    kg: number
    colore: string
    hex: string
    lotto?: string
    n: number
}
// Props per la funzione createBarChartFromCashmere
interface BarChartFromCashmereProps {
    cashmere: CashmereItem[];
}

const LottoCardShow = ({navigazione, cashmere, name, contoterzi, fornitore, lavorata, data, allFatture, stats, id} : lottoShowCardProps) => {

    const navigate = useNavigate();

    const values = [0, 0, 0, 0, 0];
    let ammount = 0

    const startPhase = cashmere
    const balle = startPhase.reduce((sum, item) => sum + item.n, 0);

    console.log(contoterzi)

    if(contoterzi){
        
    // Calcolo per cashmere.
    const kgCashmere = stats.cashmere.reduce((total: number, cashmereItem: any) => total + cashmereItem.kg, 0);
    values[0] = kgCashmere;

    // Calcolo per dalavorare.
    const kgDalavorare = stats.dalavorare.reduce((total: number, dalavorareItem: any) => total + dalavorareItem.kg, 0);
    values[1] = kgDalavorare;

    // Calcolo per lavorata.
    let kgLavorata = stats.lavorata.reduce((total: number, lavorataItem: any) => total + lavorataItem.kg, 0);

    // Calcolo per unchecked.
    const venduta = stats.venduti.reduce((total: number, vendutoItem: any) => total + vendutoItem.kg, 0);
    // Calcolo per scarto.
    const scartoTotal = stats.lavorata.reduce((total: number, lavorataItem: any) => {
      // Assicurati che 'scarto' sia un numero e aggiungilo al totale.
      // L'operatore '+' prima di 'lavorataItem.scarto' assicura che il valore sia trattato come un numero.
      return total + (lavorataItem.scarto || 0);
    }, 0);


    // Sottrai lo scarto da lavorata e aggiungi allo scarto, arrotondando a due cifre decimali.
    kgLavorata = +(kgLavorata - scartoTotal).toFixed(2);
    values[2] = kgLavorata;
    values[3] = +venduta.toFixed(2);
    values[4] = +scartoTotal.toFixed(2);

    ammount = +(kgCashmere + kgDalavorare + kgLavorata + venduta + scartoTotal).toFixed(2);

    }else{
        let kgCashmere = Array.isArray(cashmere) ? 
        cashmere.reduce((total: number, cashmereItem: any) => total + cashmereItem.kg, 0)
        : 0;

        values[0] = kgCashmere
        ammount = kgCashmere
    }

    const rows: FatturaGridProps[] = []; // Initialize an empty array to hold the transformed data

    console.log(allFatture)

    if (allFatture) {
        allFatture.forEach((fattura : any) => {
            let incassato = 0;
            let totKg = 0;
            // Ensure that allPagamenti is defined and an array before calling forEach
            if (fattura.allPagamenti) {
                fattura.allPagamenti.forEach((pagamento: PagamentiGridProps) => {
                    // Ensure that amount is a number before calling valueOf
                    incassato += typeof pagamento.ammount === 'number' ? pagamento.ammount.valueOf() : 0;
                });
            }

            if (fattura.allDdt) {
                fattura?.allDdt?.forEach((ddt: any) => {

                    ddt?.beni.forEach((bene: any) => {
                        totKg += typeof bene.kg === 'number' ? bene.kg.valueOf() : 0;
                    })
                });
            }
            console.log(fattura)
    
            let nome = fattura.cliente != null ? fattura.cliente.name : ""
    
            // Ensure that id and totale are defined before casting
            rows.push({
                id: (fattura.id as string),
                cliente: nome,
                totale: fattura.totale,
                iva: ((fattura.totale as number) / 100 * 22),
                data: fattura.data,
                scadenza: fattura.scadenza,
                note: fattura.note,
                incassato: incassato,
                saldo: ((fattura.totale as number) - incassato),
                pagato: fattura.pagato,
                ddt: fattura.allDdt.length,
                pagamenti: fattura.allPagamenti.length,
                totKg: totKg,
                _id: fattura._id,
            });
        });
    }
    console.log(rows)
    
    const dataFormat : string = new Date(data).toLocaleDateString()

    const label = ["In Magazzino","Conto Terzi","Lavorato","Venduta","Scarto"]

    const handleAddInvoice = () => {
        // Logica per aggiungere una fattura
        navigate(`/lotti/addFattura/${id}`)
        // Qui puoi navigare verso il form di aggiunta fattura o aprire un dialog/modal.
      };

      const createBarChartFromCashmere = (cashmere: any[], context: string, pie: boolean) => {
        console.log(cashmere);
        const aggregates = new Map<string, { kgSum: number, nSum: number, hex: string }>();
        const grayscale = ["#ececec", "#e2e2e2", "#d8d8d8", "#c5c5c5"];
    
        for (let item of cashmere) {
            const color = item.colore;
            const hex = item.hex === "#ffffff" || item.hex === undefined 
                        ? grayscale[Math.floor(Math.random() * grayscale.length)] 
                        : item.hex;
            
            if (!aggregates.has(color)) {
                aggregates.set(color, { kgSum: 0, nSum: 0, hex: hex });
            }
            
            const aggregate = aggregates.get(color);
            if (aggregate) {
                aggregate.kgSum += item.kg;
                aggregate.nSum += item.n;
            }
        }
    
        const Blabels = Array.from(aggregates.keys());
        const Bseries = Array.from(aggregates.values()).map(a => a.kgSum);
        const Bcolors = Array.from(aggregates.values()).map(a => a.hex);
        const totalBkg = Bseries.reduce((acc, val) => acc + val, 0);
    
        const chartProps = {
            context,
            title: "Quantità",
            value: totalBkg,
            labels: Blabels,
            series: Bseries,
            colors: Bcolors,
            type: "kg",
            cashmereItems: Array.from(aggregates.values())
        };
    
        return pie ? (
            <BiggerPieLottoChart {...chartProps} />
        ) : (
            <BarCharts {...chartProps} />
        );
    };
      
    console.log(allFatture)

    return(
        <>
            <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" fontSize={40}>
                    {name}
                </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                            <Stack direction="column" spacing={2}>
                                <Typography variant="body2" >Fornitore: {fornitore}</Typography>
                                <Typography variant="body2" >Arrivato il: {dataFormat}</Typography>
                                <Typography variant="body2" >Kg: {ammount}</Typography>
                                <Typography variant="body2" >Balle: {balle}</Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={4}>
                            <Stack direction="column" spacing={2}>
                                {startPhase.map((cash, index) => (
                                <Stack alignItems="center" direction="row" spacing={2} key={index}>
                                    <Typography variant='body2' fontWeight="bold">Cashmere {cash.kg} Kg</Typography>
                                    <Card color={`#${cash.hex}`} 
                                                        sx={{height:"20px", 
                                                        width:"20px", 
                                                            backgroundColor:`${cash.hex}`}}/>
                                    <Typography variant='body2'>{cash.colore}</Typography>
                                    <Typography variant='body2' fontWeight="bold">Balle {cash.n}</Typography>
                                </Stack>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                        {/* <Stack direction="column" spacing={2}>
                            <Typography variant="body2" >Fornitore: {fornitore}</Typography>
                            <Typography variant="body2" >Arrivato il: {dataFormat}</Typography>
                            <Typography variant="body2" >Kg: {ammount}</Typography>
                            <Typography variant="body2" >Balle: {balle}</Typography>

                            {startPhase.map((cash, index) => (
                            <Stack alignItems="center" direction="row" spacing={2} key={index}>
                                <Typography variant='body2' fontWeight="bold">Cashmere {cash.kg} Kg</Typography>
                                <Card color={`#${cash.hex}`} 
                                                    sx={{height:"20px", 
                                                    width:"20px", 
                                                        backgroundColor:`${cash.hex}`}}/>
                                <Typography variant='body2'>{cash.colore}</Typography>
                                <Typography variant='body2' fontWeight="bold">Balle {cash.n}</Typography>
                            </Stack>
                            ))}
                        </Stack> */}

                    <Grid container spacing={2}>

                        <Grid item xs={12} md={6}>
                            {createBarChartFromCashmere(startPhase, "Situazione Iniziale",false)}
                        </Grid>


                        {/* Sezione Grafico */}
                        <Grid item xs={12} md={6}>
                            <BarCharts
                                    title="Quantità"
                                    value= {ammount as number}
                                    labels={label}
                                    series={values}
                                    colors={["#355070", "#6d597a","#b56576","#eaac8b","#e56b6f"]}
                                    type= "kg"
                                />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        {stats?.cashmere.length > 0 && (
                            <>
                                <Grid item xs={12} md={6}>
                                    {createBarChartFromCashmere(stats?.cashmere, "Da Lavorare",true)}
                                </Grid>
                            </>
                        )}

                        {stats?.dalavorare.length > 0 && (
                            <>
                                <Grid item xs={12} md={6}>
                                    {createBarChartFromCashmere(stats?.dalavorare, "Al Contoterzi",true)}
                                </Grid>
                            </>
                        )}

                        {stats?.lavorata.length > 0 && (
                            <>
                                <Grid item xs={12} md={6}>
                                    {createBarChartFromCashmere(stats?.lavorata, "Lavorata",true)}
                                </Grid>
                            </>
                        )}

                        {stats?.venduti.length > 0 && (
                            <>
                                <Grid item xs={12} md={6}>
                                    {createBarChartFromCashmere(stats?.venduti, "Venduta",true)}
                                </Grid>
                            </>
                        )}
                    </Grid>
 

                    {/* Sezione Fatture */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleAddInvoice}
                                >
                                    Aggiungi Fattura
                                </Button>
                                <Box sx={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        hideFooterPagination={true}
                                        sx={{
                                            boxShadow: 2,
                                            border: 2,
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Altri Componenti o Sezioni se necessario */}
                
            </CardContent>
        </Card>
        </>
    ) 
}

export default LottoCardShow