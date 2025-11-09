export interface ChartDataPoint {
  x: number;
  y: number;
  z?: number;
}

export interface ChartSeries {
  name: string;
  data: Array<{
    x: Date;
    y: number;
    z?: number;
  }>;
}