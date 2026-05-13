import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  fill: ApexFill;
  colors: string[];
  legend: ApexLegend;
  grid: ApexGrid;
  labels: string[];
}

export interface Transaction {
  id: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  status: 'Suspended' | 'New' | 'Delete';
  date: string;
  amount: string;
}
