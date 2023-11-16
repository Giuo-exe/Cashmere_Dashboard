import { ArrowCircleUpRounded } from "@mui/icons-material"
import { Box, Stack, Typography } from "@mui/material"
import { ChartProps, ReveneuChartProps } from "interfaces/home"
import ReactApexChart from "react-apexcharts"
import { TotalRevenueOptions } from "./charts.config"
import { ApexOptions } from "apexcharts"

const LineChart = ({value,colors,max,series,title,type } : ReveneuChartProps)  => {
  
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
            <Typography fontSize={18} fontWeight={600} color="#11142d">
                Kg totali
            </Typography>

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
                series={series}
                type="line"
                height={310}
                options={{
                    title:{ 
                        text:"Product sell in 2021"},
                    xaxis:{
                        type: "datetime",
                        title:{
                            text:"Product Sell in Months"
                        },
                        categories:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                    },
                    yaxis:{
                        title:{text:"Product in K"}                 
                    }
                }}
            />
        </Box>

    </>
  )
}

export default LineChart