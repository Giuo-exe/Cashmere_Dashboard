import React from 'react';
import { Box, Stack, Typography, List, ListItem, ListItemText } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

import { ChartProps } from "interfaces/home";

const BiggerPieLottoChart = ({ title, value, series, colors, labels, type, context, cashmereItems }: ChartProps) => {
    return (
        <Box
            id="chart"
            flex={1}
            display="flex"
            flexDirection="column"
            alignItems="center"
            pl={3.5}
            py={2}
            gap={2}
            borderRadius="15px"
            minHeight="150px"
            width="fit-content"
            height="fill"
            sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ?  '#1A2027': '#fcfcfc' }}
        >
            <Typography fontSize={25} mb={2}>
                {context} 
            </Typography>

            <Stack direction="row" width="100%" justifyContent="space-between" alignItems="center">
                <ReactApexChart
                    options={{
                        chart: { type: "donut" },
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
                    type="donut"
                    width="200"
                />
                <Stack alignItems="flex-start" direction="column" spacing={2}>

                <Typography fontSize={18} variant='body2' mb={2}>
                    Totale {value} Kg
                </Typography>

                    {cashmereItems.map((aggregate : any, index : number) => (
                        <Stack alignItems="center" direction="row" spacing={2} key={index}>
                            <Typography variant='body2' fontWeight="bold" fontSize={15}>Cashmere {`${aggregate.kgSum}`} Kg</Typography>
                            <Typography variant='body2' fontSize={15}>{`${labels[index]}`}</Typography>
                            <Typography variant='body2' fontWeight="bold" fontSize={15}>Balle {`${aggregate.nSum}`}</Typography>
                        </Stack>
                    ))}

                </Stack>
            </Stack>
        </Box>
    );
};

export default BiggerPieLottoChart;