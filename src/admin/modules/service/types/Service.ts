
export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId?: number;
  categoryName?: string;
}
