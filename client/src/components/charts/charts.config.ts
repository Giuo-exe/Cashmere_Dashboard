import { ApexOptions } from 'apexcharts';


export const TotalRevenueOptions: ApexOptions = {
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  colors: ['#cdb4db', '#ffc8dd', "#ffafcc", "#bde0fe"],

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
  xaxis: {
    categories: ["","Lotto 1",""],
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

export default {TotalRevenueOptions}