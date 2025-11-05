import { PurchaseOrderModel } from './purchase-order.model';

// export interface PurchaseOrderListDto {
//   id: string;
//   poNumber: string;
//   supplierId: string;
//   supplierName?: string;
//   warehouseId: string;
//   warehouseName?: string;
//   shippingAddress: string;
//   vatRateId: string;
//   orderDate: string; // ISO date string
//   totalAmount: number;
//   status: 'Draft' | 'Approved' | 'Received';
//   items: PurchaseOrderItemModel[];
//   memoNotes?: string;
//   attachmentFileName?: string;
// }
export interface PurchaseOrderListDto extends PurchaseOrderModel {
  supplierName: string;
  warehouseName: string;
}
