export interface Product {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Name: string;
  Description: string;
  Category: string;
  SKU: string;
}

export interface Stock {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  ProductID: number;
  Product: Product;
  Quantity: number;
}

export interface StockOperationPayload {
  productId: number;
  quantity: number;
  notes?: string;
}