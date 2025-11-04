// This interface represents a warehouse where products are stored or shipped from
export interface WarehouseModel {
  warehouseId: number;
  warehouseName: string;
  warehouseAddress?: string;
}
