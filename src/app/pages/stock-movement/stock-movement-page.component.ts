import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { StockService } from '../../services/stock.service';
import { StockMovement } from '../../models/stock-movement.model';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { StockMovementDialogComponent } from './components/stock-movement-dialog/stock-movement-dialog.component';

@Component({
  selector: 'app-stock-movement-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './stock-movement-page.component.html',
})
export class StockMovementPageComponent implements OnInit {
  movements: StockMovement[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  displayedColumns: string[] = [
    'date',
    'product',
    'type',
    'quantity',
    'user',
    'notes',
  ];

  // Filters
  startDate?: Date;
  endDate?: Date;
  productFilter?: number;
  categoryFilter?: number;

  constructor(private stockService: StockService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.loadMovements();
    this.loadProducts();
    this.loadCategories();
  }

  private loadMovements() {
    const params: any = {};
    if (this.startDate) params.startDate = this.startDate.toISOString();
    if (this.endDate) params.endDate = this.endDate.toISOString();
    if (this.productFilter) params.productId = this.productFilter;
    if (this.categoryFilter) params.categoryId = this.categoryFilter;

    this.stockService.getStockMovements(params).subscribe({
      next: (movements) => {
        this.movements = movements;
      },
      error: (error) => {
        console.error('Error loading stock movements:', error);
      },
    });
  }

  private loadProducts() {
    this.stockService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  private loadCategories() {
    this.stockService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  openImportDialog() {
    const dialogRef = this.dialog.open(StockMovementDialogComponent, {
      width: '500px',
      data: { type: 'import' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMovements();
      }
    });
  }

  openExportDialog() {
    const dialogRef = this.dialog.open(StockMovementDialogComponent, {
      width: '500px',
      data: { type: 'export' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMovements();
      }
    });
  }

  applyFilters() {
    this.loadMovements();
  }

  clearFilters() {
    this.startDate = undefined;
    this.endDate = undefined;
    this.productFilter = undefined;
    this.categoryFilter = undefined;
    this.loadMovements();
  }

  getTypeLabel(type: 'import' | 'export'): string {
    return type === 'import' ? 'Import' : 'Export';
  }

  getTypeColor(type: 'import' | 'export'): string {
    return type === 'import' ? 'text-green-600' : 'text-red-600';
  }
}
