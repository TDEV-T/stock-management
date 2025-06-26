import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { StockService } from '../../services/stock.service';
import { Product } from '../../models/product.model';
import { StockMovement } from '../../models/stock-movement.model';
import { ExportCsvDialogComponent } from '../../components/export-csv-dialog/export-csv-dialog.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
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

  constructor(
    private stockService: StockService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

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

  openExportDialog(): void {
    const dialogRef = this.dialog.open(ExportCsvDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exportCsv(result.startDate, result.endDate);
      }
    });
  }

  private exportCsv(startDate: Date, endDate: Date): void {
    this.stockService.getStockMovements({}).subscribe({
      next: (movements) => {
        // Filter movements by date range
        const filteredMovements = movements.filter(movement => {
          const movementDate = new Date(movement.date);
          return movementDate >= startDate && movementDate <= endDate;
        });

        // Calculate totals for the date range
        const totalImport = filteredMovements
          .filter(movement => movement.type === 'import')
          .reduce((sum, movement) => sum + movement.quantity, 0);
        
        const totalExport = filteredMovements
          .filter(movement => movement.type === 'export')
          .reduce((sum, movement) => sum + movement.quantity, 0);

        // Prepare CSV data
        const csvData = [
          ['Date', 'SKU', 'Movement Type', 'Quantity', 'User'],
          ...filteredMovements.map(movement => [
            new Date(movement.date).toLocaleDateString(),
            movement.product?.SKU || 'N/A',
            movement.type,
            movement.quantity.toString(),
            movement.user?.username || 'N/A'
          ]),
          [], // Empty row for spacing
          ['Summary'],
          ['Type', 'Total Quantity'],
          ['Import', totalImport.toString()],
          ['Export', totalExport.toString()],
          ['Net Movement', (totalImport - totalExport).toString()]
        ];

        // Convert to CSV string
        const csvContent = csvData.map(row => row.join(',')).join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `stock_movements_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        console.error('Error exporting CSV:', error);
      }
    });
  }
}
