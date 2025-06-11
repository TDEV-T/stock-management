import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { StockService } from '../../../services/stock.service';
import { MatSnackBar } from '@angular/material/snack-bar'; // For notifications

@Component({
  selector: 'app-import-stock',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './import-stock.component.html',
})
export class ImportStockComponent {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private snackBar = inject(MatSnackBar);

  importForm = this.fb.group({
    productId: [
      null as number | null,
      [Validators.required, Validators.min(1)],
    ],
    quantity: [null as number | null, [Validators.required, Validators.min(1)]],
    notes: [''],
  });

  onSubmit(): void {
    if (this.importForm.valid) {
      const payload = {
        product_id: this.importForm.value.productId!,
        quantity: this.importForm.value.quantity!,
        notes: this.importForm.value.notes || '',
      };
      this.stockService.importStock(payload).subscribe({
        next: (response) => {
          this.snackBar.open('Stock imported successfully!', 'Close', {
            duration: 3000,
          });
          this.importForm.reset();
        },
        error: (err) => {
          this.snackBar.open(
            `Error importing stock: ${err.error?.error || err.message}`,
            'Close',
            { duration: 5000 }
          );
        },
      });
    }
  }
}
