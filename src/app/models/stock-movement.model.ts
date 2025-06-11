import { Product } from './product.model';
import { User } from './user.model';

export interface StockMovement {
  type: 'import' | 'export';
  quantity: number;
  date: Date;
  notes: string;
  product: {
    name: string;
    imageURL: string;
  };
  user: {
    username: string;
  };
} 