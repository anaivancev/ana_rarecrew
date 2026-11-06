import { afterRenderEffect, Component, computed, ElementRef, input, viewChild } from '@angular/core';
import { ArcElement, Chart, Legend, PieController, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Employee } from '../../models/employee';

Chart.register(PieController, ArcElement, Legend, Tooltip, ChartDataLabels);

const SLICE_COLORS = [
  '#b5562a',
  '#6b3fa0',
  '#2a7f9e',
  '#3c8d40',
  '#c23b6f',
  '#8a6d1f',
  '#3f51b5',
  '#00796b',
  '#a03030',
  '#5d6b7a',
];

@Component({
  imports: [],
  selector: 'app-employee-chart',
  styleUrl: './employee-chart.css',
  templateUrl: './employee-chart.html',
})
export class EmployeeChart {
  readonly employees = input.required<Employee[]>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly allHours = computed(() =>
    this.employees().reduce((sum, employee) => sum + employee.totalHours, 0),
  );

  constructor() {
    afterRenderEffect((onCleanup) => {
      const chart = this.createChart();
      onCleanup(() => chart.destroy());
    });
  }

  private createChart(): Chart<'pie'> {
    const employees = this.employees();

    return new Chart(this.canvas().nativeElement, {
      type: 'pie',
      data: {
        labels: employees.map((employee) => employee.name),
        datasets: [
          {
            data: employees.map((employee) => employee.totalHours),
            backgroundColor: SLICE_COLORS,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (item) => `${Math.round(item.parsed)} hrs (${this.percentOf(item.parsed)}%)`,
            },
          },
          datalabels: {
            color: '#ffffff',
            font: { weight: 'bold' },
            formatter: (hours: number) => `${this.percentOf(hours)}%`,
          },
        },
      },
    });
  }

  private percentOf(hours: number): number {
    return Math.round((hours / this.allHours()) * 100);
  }
}
