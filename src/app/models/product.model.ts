import { Category } from './category.model';

export interface Product {
  id: string;
  SKU: string;
  name: string;
  description?: string;
  categoryId: string;
  quantity?: number;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}
