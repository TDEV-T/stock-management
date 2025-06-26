import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StockService } from '../../../../services/stock.service';
import { Product } from '../../../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-stock-movement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.type === 'import' ? 'Import' : 'Export' }} Stock
    </h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="w-full mb-4">
          <mat-label>Product</mat-label>
          <mat-select formControlName="productId" required>
            @for (product of products; track product.id) {
            <mat-option [value]="product.id">{{ product.name }}</mat-option>
            }
          </mat-select>
          @if (form.get('productId')?.hasError('required') &&
          form.get('productId')?.touched) {
          <mat-error>Product is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full mb-4">
          <mat-label>Quantity</mat-label>
          <input
            matInput
            type="number"
            formControlName="quantity"
            required
            min="1"
          />
          @if (form.get('quantity')?.hasError('required') &&
          form.get('quantity')?.touched) {
          <mat-error>Quantity is required</mat-error>
          } @if (form.get('quantity')?.hasError('min') &&
          form.get('quantity')?.touched) {
          <mat-error>Quantity must be greater than 0</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" rows="3"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          {{ data.type === 'import' ? 'Import' : 'Export' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
})
export class StockMovementDialogComponent {
  form: FormGroup;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StockMovementDialogComponent>,
    private stockService: StockService,
    private snackBar:MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { type: 'import' | 'export' }
  ) {
    this.form = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      notes: [''],
    });

    this.loadProducts();
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

  onSubmit() {
    if (this.form.valid) {
      const { productId, quantity, notes } = this.form.value;
      
      const operation =
        this.data.type === 'import'
          ? this.stockService.importStock({
              productId,
              quantity,
              notes,
            })
          : this.stockService.exportStock({
              productId,
              quantity,
              notes,
            });

      operation.subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error(`Error ${this.data.type}ing stock:`, error);
          this.snackBar.open(error.error.error, 'Close', {
            duration: 3000,
          });
          // You might want to show an error message to the user here
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
