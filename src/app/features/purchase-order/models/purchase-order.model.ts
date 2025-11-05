export interface PurchaseOrderModel {
  id: string;
  poNumber: string;
  supplierId: string;
  warehouseId: string;
  shippingAddress: string;
  vatRateId: string;
  orderDate: string; // ISO date string
  totalAmount: number;
  status: 'Draft' | 'Approved' | 'Received';
  items: PurchaseOrderItemModel[];
  memoNotes?: string;
  attachmentFileName?: string;
}

export interface PurchaseOrderItemModel {
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
