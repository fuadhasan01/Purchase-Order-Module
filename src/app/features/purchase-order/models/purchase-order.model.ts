export interface PurchaseOrderModel {
  id: string;
  poNumber: string;
  supplierId: number;
  warehouseId: number;
  shippingAddress: string;
  vatRateId: number;
  orderDate: string; // ISO date string
  totalAmount: number;
  status: 'Draft' | 'Approved' | 'Received';
  items: PurchaseOrderItemModel[];
  memoNotes?: string;
  attachmentFileName?: string;
}

export interface PurchaseOrderItemModel {
  productId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
