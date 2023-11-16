import { ArrowCircleUpRounded } from "@mui/icons-material"
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
    const labelSeries = TotalRevenueSeries(series)

    

    const TotalRevenueOptions: ApexOptions = {
            series: labelSeries,
            
            chart: {
                toolbar: {
                    show: false,
                },
                height: 350,
                type: 'line',
            },
            forecastDataPoints: {
                count: 7
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
            categories
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
                    <ArrowCircleUpRounded
                        sx={{ fontSize: 25, color: "#475be8" }}
                    />
                    <Stack>
                        <Typography fontSize={15} color="#475be8">
                            0.8%
                        </Typography>
                        <Typography fontSize={12} color="#808191">
                            Than Last Month
                        </Typography>
                    </Stack>
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