import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseOrderModel } from '../models/purchase-order.model';
import { SupplierModel } from '../models/supplier.model';
import { WarehouseModel } from '../models/warehouse.model';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { VatRateModel } from '../models/vat-rate.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private apiUrl = 'http://localhost:3000/purchaseOrders';
  constructor(private httpClient: HttpClient) {}
  getPurchaseOrders() {
    return this.httpClient.get<PurchaseOrderModel[]>(this.apiUrl);
  }
  createPurchaseOrder(data: any): Observable<any> {
    return this.httpClient.post(this.apiUrl, data);
  }
  getSuppliers(): Observable<SupplierModel[]> {
    return this.httpClient.get<SupplierModel[]>('http://localhost:3000/suppliers');
  }
  getWarehouses(): Observable<WarehouseModel[]> {
    return this.httpClient.get<WarehouseModel[]>('http://localhost:3000/warehouses');
  }
  getProducts(): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>('http://localhost:3000/products');
  }
  getVatRates(): Observable<VatRateModel[]> {
    return this.httpClient.get<VatRateModel[]>('http://localhost:3000/vatRates');
  }

  deletePurchaseOrder(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
