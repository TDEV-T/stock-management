import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StockService } from '../../../services/stock.service';
import { Stock } from '../../../models/stock.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-current-stock',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './current-stock.component.html',
})
export class CurrentStockComponent implements OnInit {
  private stockService = inject(StockService);

  stocks$: Observable<Stock[]> | undefined;
  displayedColumns: string[] = [
    'productName',
    'sku',
    'category',
    'quantity',
    'updatedAt',
  ];
  isLoading = true;

  ngOnInit(): void {
    this.stocks$ = this.stockService.getCurrentStock();
    this.stocks$.subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });
  }
}