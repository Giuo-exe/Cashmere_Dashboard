import { ArrowCircleUpRounded } from "@mui/icons-material"
import { Box, Stack, Typography } from "@mui/material"
import ReactApexChart from "react-apexcharts"
import { TotalRevenueOptions } from "./charts.config"
import { ApexOptions } from "apexcharts"

// Assuming ColorInfo and GiacenzaItem are defined somewhere
interface ColorInfo {
  name: string;
  codice: string;
  hex: string;
}

interface GiacenzaItem {
  totaleKg: number;
  colorInfo: ColorInfo;
}

interface ChartProps {
  title: string;
  value: number;
  giacenza: any;
  type: string;
  context?: string;
}

const TotalRevenueSeries = (giacenza : any) => {
    // This will create a series for each giacenza item
    const seriesData = giacenza.map((item : any) => {
        return {
            x: `${item.colorInfo.name} ${item.colorInfo.codice}`,
            y: item.totaleKg
        };
    });

    return [{
        name: 'Total Kg',
        data: seriesData
    }];
};

const GiacenzaBarChart = ({ title, value, giacenza, type, context }: ChartProps) => {
    const TotalRevenueOptions: ApexOptions = {
        chart: {
          type: 'bar',
          toolbar: {
            show: false,
          },
        },
        colors: giacenza.map((item : any) => item.colorInfo.hex),
        xaxis: {
          categories: giacenza.map((item : any) => `${item.colorInfo.name} ${item.colorInfo.codice}`),
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: '55%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          show: false,
        },
        stroke: {
          colors: ['transparent'],
          width: 4,
        },
        yaxis: {
          title: {
            text: 'Kg',
          },
        },
        fill: {
          opacity: 1,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
        },
        tooltip: {
          y: {
            formatter(val: number) {
              return `${val} Kg`;
            },
          },
        },
      };

      const labelSeries = TotalRevenueSeries(giacenza)
      console.log(TotalRevenueOptions)
        console.log(labelSeries)
  
  return(
    <>
      <Box
            p={4}
            flex={1}
            bgcolor="#fcfcfc"
            id="chart"
            display="flex"
            flexDirection="column"
            borderRadius="15px"
        >
          {context !== undefined ? (
              <Typography fontSize={18} fontWeight={600} color="#11142d">
                  Kg totali - {context} 
              </Typography>
          ) : <Typography fontSize={18} fontWeight={600} color="#11142d">
                  Kg totali
              </Typography>}
            <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
                <Typography fontSize={28} fontWeight={700} color="#11142d">
                  {value} Kg
                </Typography>
                {/* <Stack direction="row" alignItems="center" gap={1}>
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
                </Stack> */}
            </Stack>

            <ReactApexChart
                series={labelSeries}
                type="bar"
                height={310}
                options={TotalRevenueOptions}
            />
        </Box>
    </>
  )
}

export default GiacenzaBarChart