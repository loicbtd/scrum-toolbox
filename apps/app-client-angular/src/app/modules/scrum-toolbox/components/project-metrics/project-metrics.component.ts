import { Component } from '@angular/core';

@Component({
  template: `
    <div class="chart-container">
      <p-chart class="chart" type="line" [data]="basicData" [options]="basicOptions"></p-chart>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        display: flex;
      }

      .chart-container {
        margin: auto;
        width: 80vw;
        height: 80vh;
      }
    `,
  ],
})
export class MetricsComponent {
  basicData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day'],
    datasets: [
      {
        label: 'Burndown chart',
        data: [100, 80, 60, 60, 50, 28, 24, 20, 15, 0],
        fill: false,
        borderColor: '#42A5F5',
      },
    ],
  };

  basicOptions = {
    stacked: false,
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: '#495057',
        },
        grid: {
          drawOnChartArea: false,
          color: '#ebedef',
        },
      },
    },
  };

  getRandomDataSets() {
    const dataSets = [
      {
        label: '',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4,
      },
    ];

    return dataSets[Math.floor(Math.random() * dataSets.length)];
  }
}
