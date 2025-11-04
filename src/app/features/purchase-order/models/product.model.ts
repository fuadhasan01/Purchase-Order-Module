// This interface represents a product that can be added to a purchase order
export interface ProductModel {
  productId: number;
  productName: string;
  productDescription?: string;
  defaultUnitPrice?: number;
}
