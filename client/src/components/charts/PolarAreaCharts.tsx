import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { ChartProps, RadialProps } from "interfaces/home";

const PolarChart = ({ title, RemainingValue, ContoterziValue, series, colors, labels, type }: RadialProps) => {
    return (
        <Box
            id="chart"
            flex={1}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            p={2} // Rimuovi pl e py, usa p per un padding uniforme se necessario
            gap={2}
            borderRadius="15px"
            minHeight="150px"
            width="100%" // Usa 100% o una misura fissa per la larghezza del Box
            height="auto" // L'altezza può essere auto per adattarsi al contenuto
        >
            <Stack direction="row" mx="auto">

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
                        {RemainingValue} Kg
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
                        {ContoterziValue} Kg
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    );
};

export default PolarChart;