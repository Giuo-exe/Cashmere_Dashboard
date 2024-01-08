import { ArrowCircleUpRounded,  ArrowCircleDownRounded} from "@mui/icons-material"
import { Box, Stack, Typography } from "@mui/material"
import { ChartProps, ReveneuChartProps } from "interfaces/home"
import ReactApexChart from "react-apexcharts"
import { TotalRevenueOptions } from "./charts.config"
import { ApexOptions } from "apexcharts"

const TotalRevenueSeries = (series : Array<number>, labels : Array<string>) => {
    const data = labels.map((label, index) => ({ x: label, y: series[index] }));
    return [
      {
        data: data,
      },
    ];
}

const TreemapChart = ({ title, value, series, colors, labels }: ChartProps) => {

    const LabelSeries = TotalRevenueSeries(series,labels)

    const TotalRevenueOptions: ApexOptions  = {
        series: series,
        colors: colors, // Dynamic colors array from props
        chart:{
            toolbar: {
                show: false
            }
        },
        plotOptions: {
          treemap: {
            distributed: true,
            enableShades: false,
          },
        },
        legend: {
          show: false, // Assuming you want to hide the legend, set this based on your needs
        },
        
      };

      const indice = findMaxIndex(series)

      const totalSum = sumSeries(series);

    return (
    <Box
            p={4}
            flex={1}
            id="chart"
            display="flex"
            flexDirection="column"
            borderRadius="15px"
            height="400px" // Adjust the height as needed
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#1A2027' : '#fcfcfc',
                maxHeight: '400px', // Ensure the max height is respected
            }}
        >

            <Stack my="20px" direction="row" gap={1} flexWrap="wrap" justifyContent="space-between">
                <Typography fontSize={28} fontWeight={700} color="#11142d">
                    Colore preferito{" "}
                    <span style={{ color: colors[indice || 0] || "#ffffff" }}>
                        {labels[indice || 0] || ""}
                    </span>
                </Typography>

                <Typography fontSize={28} fontWeight={700} color="#11142d">
                    KG Totali {" "}
                    <span style={{ color: colors[indice || 0] || "#ffffff" }}>
                        {totalSum.toFixed(2)}
                    </span>
                </Typography>
            </Stack>

            <ReactApexChart
                options={TotalRevenueOptions}
                series={LabelSeries}
                type="treemap"
                width="100%" // Responsive width
                height="80%" // Make sure the height is responsive as well
            />
      </Box>
    );
  };

  function findMaxIndex(series: number[]): number | null {
    if (series.length === 0) {
      return null; // or undefined, depending on your preference
    }
    return series.indexOf(Math.max(...series));
  }

  function sumSeries(series: number[]): number {
    return series.reduce((total, num) => total + num, 0);
  }
  

export default TreemapChart