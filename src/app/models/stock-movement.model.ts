import { Product } from './product.model';
import { User } from './user.model';

export interface StockMovement {
  type: 'import' | 'export';
  quantity: number;
  date: Date;
  notes: string;
  product: Product;
  user: User;
} 