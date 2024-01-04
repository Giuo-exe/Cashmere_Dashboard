import { ArrowCircleUpRounded,  ArrowCircleDownRounded} from "@mui/icons-material"
import { Box, Stack, Typography } from "@mui/material"
import { ChartProps, ReveneuChartProps } from "interfaces/home"
import ReactApexChart from "react-apexcharts"
import { TotalRevenueOptions } from "./charts.config"
import { ApexOptions } from "apexcharts"

const TotalRevenueSeries = (series : Array<number>) => {

      return [{
          name: "€ totali",
          data: series
      }];
}

const ReveneuChart = ({ title, value, series, colors, max }: ReveneuChartProps) => {
    const categories = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"]

    console.log(series)

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();


    function reorderCategories(categories : any, currentMonth : any, currentYear : any) {
      // Dividi l'array nei mesi passati e nei mesi futuri (incluso il mese corrente)
      const pastMonths = categories.slice(0, currentMonth + 1);
      const upcomingMonths = categories.slice(currentMonth + 1);
  
      // Riordina e aggiungi l'anno
      const reordered = upcomingMonths.concat(pastMonths).map((month : any, index : number) => {
          // Determina l'anno corretto per ogni mese
          const yearSuffix = (index < categories.length - currentMonth - 1) ? currentYear - 1 : currentYear;
          return `${month} ${yearSuffix}`;
      });
  
      return reordered;
  }

    // Riordina l'array e aggiungi l'anno
    const reorderedCategories = reorderCategories(categories, currentMonth, currentYear);
    console.log(reorderedCategories)



    const labelSeries = TotalRevenueSeries(series)

    let calculateIncrement = 0;

// Assicurati che l'ultimo elemento (serie[11]) e il penultimo (serie[10]) non siano zero,
// e che il penultimo elemento (serie[10]) sia diverso da zero per evitare la divisione per zero.
    if(series[11] !== 0 && series[10] !== 0){
        calculateIncrement = (((series[11] - series[10]) / series[10]) * 100);
        calculateIncrement = Number(calculateIncrement); // Converte la stringa risultante in un numero
    } else {
        // Imposta un valore significativo o un messaggio per indicare che il calcolo non è possibile o non è significativo
        calculateIncrement = 0
    }


    

    const TotalRevenueOptions: ApexOptions = {
            series: labelSeries,
            
            chart: {
                toolbar: {
                    show: true,
                },
                height: 350,
                type: 'line',
            },
            forecastDataPoints: {
                count: 1
            },
            grid: {
              show: false,
            },
          dataLabels: {
              enabled: false,
            },
          stroke: {
            width: 5,
            curve: 'smooth'
          },

          xaxis:{
            type:'category',
            categories : reorderedCategories
          },
          
          fill: {
            type: 'gradient',
                gradient: {
                  shade: 'dark',
                  gradientToColors: [ '#7E35FC', "#E34828"],
                  shadeIntensity: 2,
                  type: 'horizontal',
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 200, 200, 200]
                },
          },
          yaxis: {
            min: -(max/20),
            max: max
          }
  
    }

  
  return(
    <>
      <Box
            p={4}
            flex={1}
            id="chart"
            display="flex"
            flexDirection="column"
            borderRadius="15px"
            sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ?  '#1A2027': '#fcfcfc' }}
        >
            <Typography fontSize={18} fontWeight={600} color="#11142d">
                Incassi Totali
            </Typography>

            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                <Typography fontSize={28} fontWeight={700} color="#11142d">
                    {value} €
                </Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                  {calculateIncrement >= 0 ? (
                    <>
                      <ArrowCircleUpRounded
                          sx={{ fontSize: 25, color: "#475be8" }}
                      />
                      <Stack>
                          <Typography fontSize={15} color="#475be8">
                              {calculateIncrement.toFixed(2)} %
                          </Typography>
                          <Typography fontSize={12} color="#808191">
                              Rispetto Al Mese Precendente
                          </Typography>
                      </Stack>
                    </>
                  ) : (
<>
                      <ArrowCircleDownRounded
                          sx={{ fontSize: 25, color: "#E80000" }}
                      />
                      <Stack>
                          <Typography fontSize={15} color="#E80000">
                              {calculateIncrement.toFixed(2)} %
                          </Typography>
                          <Typography fontSize={12} color="#808191">
                              Rispetto Al Mese Precendente
                          </Typography>
                      </Stack>
                    </>
                  )}
                    
                </Stack>
            </Stack>

            <ReactApexChart
                series={labelSeries}
                type={"line"}
                height={310}
                options={TotalRevenueOptions}
            />
        </Box>

    </>
  )
}

export default ReveneuChart