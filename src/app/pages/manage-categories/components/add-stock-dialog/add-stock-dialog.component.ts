import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Product } from '../../../../models/product.model';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-add-stock-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './add-stock-dialog.component.html',
})
export class AddStockDialogComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddStockDialogComponent>);

  addStockForm: FormGroup;

  // สมมติว่ามี categories ให้เลือก (ควรดึงมาจาก service จริง)
  categories: Category[] = [
    { id: 'cat1', name: 'Electronics' },
    { id: 'cat2', name: 'Books' },
    { id: 'cat3', name: 'Clothing' },
  ];

  constructor() {
    this.addStockForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  onSave(): void {
    if (this.addStockForm.valid) {
      // TODO: Implement save logic (e.g., call a service)
      this.dialogRef.close(this.addStockForm.value as Product);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
