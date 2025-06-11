import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
import { CategoryService } from '../../../../services/category.service';

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
export class AddStockDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddStockDialogComponent>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });
  private categoryService = inject(CategoryService);

  addStockForm: FormGroup;
  isEditMode = false;
  categories: Category[] = [];

  constructor() {
    this.addStockForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: ['', Validators.required],
      imageURL: [''],
    });
  }

  ngOnInit() {
    this.loadCategories();
    if (this.data) {
      this.isEditMode = true;
      this.addStockForm.patchValue(this.data);
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  onSave(): void {
    if (this.addStockForm.valid) {
      this.dialogRef.close(this.addStockForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
