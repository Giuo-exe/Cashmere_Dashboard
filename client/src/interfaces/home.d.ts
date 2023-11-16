export interface ChartProps {
    title: string,
    value: number,
    series: Array<number>
    colors: Array<string>
    labels: Array<string>
    type: string
    context?: string
    cashmereItems?: any
}

export interface DonutChartProps {
    title: string,
    value: number,
    series: Array<number>
    colors: Array<string>
    labels: Array<string>
    type: string
}

export interface ReveneuChartProps {
    title: string,
    value: number,
    series: Array<number>
    colors: Array<string>
    type?: string
    max: number
}



