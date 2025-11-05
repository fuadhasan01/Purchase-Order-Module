// This interface represents a product that can be added to a purchase order
export interface ProductModel {
  productId: string;
  productName: string;
  productDescription?: string;
  defaultUnitPrice?: number;
}
