import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { AddCategoryDialogComponent } from './components/add-category-dialog/add-category-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-manage-categories-page',
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
  templateUrl: './manage-categories-page.component.html',
})
export class ManageCategoriesPageComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Category>;

  displayedColumns: string[] = ['name', 'description', 'actions'];
  nameFilter: String = '';
  categories: Category[] = [];
  filterCategories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterCategories = categories;
      },
      error: (error) => {
        this.snackBar.open('Error loading categories', 'Close', {
          duration: 3000,
        });
        console.error('Error loading categories:', error);
      },
    });
  }

  applyFilters() {
    this.filterCategories = this.categories.filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(this.nameFilter.toLowerCase());

      return matchesName;
    });

    if (this.table) {
      this.table.renderRows();
    }
  }

  openAddCategoryDialog(category?: Category): void {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '500px',
      data: category,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (category) {
          // Update existing category
          this.categoryService.updateCategory(category.id, result).subscribe({
            next: () => {
              this.loadCategories();
              this.snackBar.open('Category updated successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              this.snackBar.open('Error updating category', 'Close', {
                duration: 3000,
              });
              console.error('Error updating category:', error);
            },
          });
        } else {
          // Create new category
          this.categoryService.createCategory(result).subscribe({
            next: () => {
              this.loadCategories();
              this.snackBar.open('Category added successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              this.snackBar.open('Error adding category', 'Close', {
                duration: 3000,
              });
              console.error('Error adding category:', error);
            },
          });
        }
      }
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
          this.snackBar.open('Category deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.snackBar.open('Error deleting category', 'Close', {
            duration: 3000,
          });
          console.error('Error deleting category:', error);
        },
      });
    }
  }
}
