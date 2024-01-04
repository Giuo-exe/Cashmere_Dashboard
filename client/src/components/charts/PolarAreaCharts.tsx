import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { ChartProps } from "interfaces/home";

const PolarChart = ({ title, value, series, colors, labels, type }: ChartProps) => {
    return (
        <Box
            id="chart"
            flex={1}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            pl={3.5}
            py={2}
            gap={2}
            borderRadius="15px"
            minHeight="150px"
            width="fit-content"
            height="fill"
        >
            <Stack direction="column">
                <Typography fontSize={14} color="#808191">
                    {title}
                </Typography>
                <Typography
                    fontSize={24}
                    color="#11142d"
                    fontWeight={700}
                    mt={1}
                >
                    {value} Kg
                </Typography>
            </Stack>

            <ReactApexChart
                options={{
                    colors,
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
                type="radialBar"
                width="300px"
            />
        </Box>
    );
};

export default PolarChart;