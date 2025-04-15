
export interface Product {
  id: number;
  name: string;
  description?: string;
  price?: number;
  sku?: string;
  imageUrl?: string;
  category?: string;
  stock?: number;
}
