import { Product } from './product.model';

export interface PaginatedProducts {
  data: Product[];
  total: number;
}
