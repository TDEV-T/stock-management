import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { StockService } from '../../../services/stock.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-export-stock',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './export-stock.component.html',
})
export class ExportStockComponent {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private snackBar = inject(MatSnackBar);

  exportForm = this.fb.group({
    productId: [null as number | null, [Validators.required, Validators.min(1)]],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    notes: [''],
  });

  onSubmit(): void {
    if (this.exportForm.valid) {
      const payload = {
        product_id: this.exportForm.value.productId!,
        quantity: this.exportForm.value.quantity!,
        notes: this.exportForm.value.notes || '',
      };
      this.stockService.exportStock(payload).subscribe({
        next: (response) => {
          this.snackBar.open('Stock exported successfully!', 'Close', { duration: 3000 });
          this.exportForm.reset();
        },
        error: (err) => {
          this.snackBar.open(`Error exporting stock: ${err.error?.error || err.message}`, 'Close', { duration: 5000 });
        },
      });
    }
  }
}