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
  value?: number;
  giacenza: any;
  type: string;
  context?: string;
}

const TotalRevenueSeries = (labels: Array<string>, series: Array<number>, colors : Array<string>) => {
  // Create a single series object with an array of data points
  let result = {
    name: "Total Revenue",
    data: series.map((value, index) => ({
      x: labels[index],
      y: (value.toFixed(2))
    }))
  };

  // Return an array containing just this one series object
  return [result];
};

const GiacenzaBarChart = ({ title, giacenza, type, context }: ChartProps) => {
  const colors = giacenza.map((item : any) => item.colorInfo.hex)
  const categories = giacenza.map((item : any) => `${item.colorInfo.name} ${item.colorInfo.codice}`)
  const series =  giacenza.map((item : any) => item.totalKg)
  
  const value = giacenza.reduce((accumulator : number, currentValue : any) => accumulator + currentValue.totalKg, 0);

  const labelSeries = TotalRevenueSeries(categories,series,colors)

  const TotalRevenueOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      },
    },
    colors,
    xaxis: {
      categories,
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