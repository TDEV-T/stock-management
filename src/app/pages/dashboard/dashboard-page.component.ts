import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Chart, registerables } from 'chart.js';
import { StockService } from '../../services/stock.service';
import { Product } from '../../models/product.model';
import { StockMovement } from '../../models/stock-movement.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent implements OnInit {
  totalProducts = 0;
  totalStock = 0;
  totalImport = 0;
  totalExport = 0;

  // Chart data
  lineChartData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        label: 'Import',
        borderColor: '#4CAF50',
        fill: false,
      },
      {
        data: [] as number[],
        label: 'Export',
        borderColor: '#F44336',
        fill: false,
      },
    ],
  };

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Load products and stock summary
    this.stockService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.totalStock = products.reduce(
          (sum, product) => sum + product.quantity!,
          0
        );
      },
    });

    // Load stock movements for chart
    this.stockService.getStockMovements({}).subscribe({
      next: (movements) => {
        // Group movements by date
        const groupedMovements = this.groupMovementsByDate(movements);
        
        // Initialize chart
        const ctx = document.getElementById('stockChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: Object.keys(groupedMovements),
            datasets: [
              {
                label: 'Import',
                data: Object.values(groupedMovements).map(data => data.import),
                borderColor: '#4CAF50',
                fill: false
              },
              {
                label: 'Export',
                data: Object.values(groupedMovements).map(data => data.export),
                borderColor: '#F44336',
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });

        // Calculate totals
        this.totalImport = movements
          .filter((m) => m.type === 'import')
          .reduce((sum, m) => sum + m.quantity, 0);
        this.totalExport = movements
          .filter((m) => m.type === 'export')
          .reduce((sum, m) => sum + m.quantity, 0);
      },
    });
  }

  private groupMovementsByDate(movements: StockMovement[]) {
    const grouped: { [key: string]: { import: number; export: number } } = {};

    movements.forEach((movement) => {
      const date = new Date(movement.date).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { import: 0, export: 0 };
      }
      if (movement.type === 'import') {
        grouped[date].import += movement.quantity;
      } else {
        grouped[date].export += movement.quantity;
      }
    });

    return grouped;
  }
}
