import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddStockDialogComponent } from './components/add-stock-dialog/add-stock-dialog.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-manage-stock-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './manage-stock-page.component.html',
})
export class ManageStockPageComponent implements OnInit {
  private dialog = inject(MatDialog);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  @ViewChild(MatTable) table!: MatTable<Product>;

  displayedColumns: string[] = [
    'image',
    'name',
    'description',
    'category',
    'quantity',
    'actions',
  ];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];

  // Filter properties
  nameFilter: string = '';
  categoryFilter: string = '';

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.applyFilters();
      },
      error: (error) => {
        this.snackBar.open('Error loading products', 'Close', {
          duration: 3000,
        });
        console.error('Error loading products:', error);
      },
    });
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

  applyFilters() {
    this.filteredProducts = this.products.filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(this.nameFilter.toLowerCase());
      const matchesCategory =
        !this.categoryFilter || product.category?.id === this.categoryFilter;
      return matchesName && matchesCategory;
    });

    if (this.table) {
      this.table.renderRows();
    }
  }

  clearFilters() {
    this.nameFilter = '';
    this.categoryFilter = '';
    this.applyFilters();
  }

  openAddStockDialog(product?: Product): void {
    const dialogRef = this.dialog.open(AddStockDialogComponent, {
      width: '500px',
      data: product,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (product) {
          // Update existing product
          this.productService.updateProduct(product.id, result).subscribe({
            next: () => {
              this.loadProducts();
              this.snackBar.open('Product updated successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              this.snackBar.open('Error updating product', 'Close', {
                duration: 3000,
              });
              console.error('Error updating product:', error);
            },
          });
        } else {
          // Create new product
          this.productService.createProduct(result).subscribe({
            next: () => {
              this.loadProducts();
              this.snackBar.open('Product added successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              this.snackBar.open('Error adding product', 'Close', {
                duration: 3000,
              });
              console.error('Error adding product:', error);
            },
          });
        }
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.snackBar.open('Error deleting product', 'Close', {
            duration: 3000,
          });
          console.error('Error deleting product:', error);
        },
      });
    }
  }
}
