import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Stock, StockOperationPayload } from '../models/stock.model';
import { environment } from '../environments/environment'; // Assuming you have an environment file
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { StockMovement } from '../models/stock-movement.model';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  private getAuthHeaders(): HttpHeaders {
    // Assuming token is stored in localStorage. Adjust as per your auth implementation.
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  importStock(payload: StockOperationPayload): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    // Decode JWT token to get user ID
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.userId;

    return this.http.post(
      `${this.apiUrl}/stock/import`,
      { ...payload, userId },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  exportStock(payload: StockOperationPayload): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return throwError(() => new Error('No authentication token found'));
    }

    // Decode JWT token to get user ID
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const userId = tokenPayload.userId;

    return this.http.post(
      `${this.apiUrl}/stock/export`,
      { ...payload, userId },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getCurrentStock(): Observable<Stock[]> {
    // The backend handler for /current actually calls GetStockSummary
    // Let's align with the backend's GetStockSummary which is mapped to /summary
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/summary`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Product Management
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  // Category Management
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(
    id: number,
    category: Partial<Category>
  ): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // Stock Movement Management
  getStockMovements(filters: any): Observable<StockMovement[]> {
    return this.http.post<StockMovement[]>(`${this.apiUrl}/stock/movements`, filters);
  }

  createStockMovement(
    movement: Partial<StockMovement>
  ): Observable<StockMovement> {
    return this.http.post<StockMovement>(
      `${this.apiUrl}/stock-movements`,
      movement
    );
  }

  // Add other methods like getStockMovements if needed later
  // getStockMovements(startDate?: string, endDate?: string, productId?: number, category?: string): Observable<any> {
  //   // ... implementation
  // }
}
