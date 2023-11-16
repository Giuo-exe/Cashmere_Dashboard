import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { DonutChartProps } from "interfaces/home";

const DonutChart = ({ title, value, series, colors, labels, type }: DonutChartProps) => {

    console.log(series,colors, labels)
    return (
        <Box
            id="chart"
            flex={1}
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            pl={3.5}
            py={2}
            gap={2}
            borderRadius="15px"
            minHeight="110px"
            width="fit-content"
            sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ?  '#1A2027': '#fcfcfc' }}
        >
            <Stack direction="column">
                <Typography fontSize={14} color="#808191">
                    {title}
                </Typography>
                <Typography
                    fontSize={24}
                    sx={{ color: (theme) => theme.palette.mode === 'dark' ?  '#fff' : '#1A2027' }}
                    fontWeight={700}
                    mt={1}
                >
                    {value}{type}
                </Typography>
            </Stack>

            <ReactApexChart
               
                options={{
                    chart: { type: "donut" },
                    colors,
                    // legend: { show: false },
                    legend: {
                        show: true,
                        floating: true,
                        position: 'right',
                        offsetX: 70,
                        offsetY: 240
                      },
                    dataLabels: { enabled: false },
                    labels
                }}
                series={series}
                type={"donut"}
                width="120px"
            />
        </Box>
    );
};

export default DonutChart;