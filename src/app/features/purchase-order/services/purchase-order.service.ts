import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseOrderModel } from '../models/purchase-order.model';
import { SupplierModel } from '../models/supplier.model';
import { WarehouseModel } from '../models/warehouse.model';
import { BehaviorSubject, forkJoin, map, Observable, Subject, take, tap } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { VatRateModel } from '../models/vat-rate.model';
import { PurchaseOrderListDto } from '../models/po-list.dto';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private apiUrl = 'http://localhost:3000/purchaseOrders';
  private suppliersUrl = 'http://localhost:3000/suppliers';
  private warehousesUrl = 'http://localhost:3000/warehouses';
  private productsUrl = 'http://localhost:3000/products';
  private vatRatesUrl = 'http://localhost:3000/vatRates';

  private purchaseOrderObs$ = new BehaviorSubject<PurchaseOrderListDto[]>([]);
  purchaseOrders$ = this.purchaseOrderObs$.asObservable();

  constructor(private httpClient: HttpClient) {}

  loadPurchaseOrders(): void {
    this.getPurchaseOrdersWithDetails()
      .pipe(take(1))
      .subscribe({
        next: (data) => this.purchaseOrderObs$.next(data),
        error: (err) => console.error('Error loading POs:', err),
      });
  }

  // getPurchaseOrders() {
  //   return this.httpClient.get<PurchaseOrderModel[]>(this.apiUrl);
  // }

  getPurchaseOrdersWithDetails(): Observable<PurchaseOrderListDto[]> {
    return forkJoin({
      purchaseOrders: this.httpClient.get<PurchaseOrderModel[]>(this.apiUrl),
      suppliers: this.httpClient.get<SupplierModel[]>(this.suppliersUrl),
      warehouses: this.httpClient.get<WarehouseModel[]>(this.warehousesUrl),
    }).pipe(
      map(({ purchaseOrders, suppliers, warehouses }) =>
        purchaseOrders.map((po) => ({
          ...po,
          supplierName:
            suppliers.find((s) => s.supplierId === po.supplierId)?.supplierName ||
            'Unknown Supplier',
          warehouseName:
            warehouses.find((w) => w.warehouseId === po.warehouseId)?.warehouseName ||
            'Unknown Warehouse',
        }))
      )
    );
  }

  createPurchaseOrder(data: any): Observable<any> {
    return this.httpClient.post(this.apiUrl, data).pipe(
      tap(() => {
        this.loadPurchaseOrders();
      })
    );
  }

  updatePurchaseOrder(id: string, poData: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/${id}`, poData).pipe(
      tap(() => {
        this.loadPurchaseOrders();
      })
    );
  }

  deletePurchaseOrder(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadPurchaseOrders();
      })
    );
  }

  getSuppliers(): Observable<SupplierModel[]> {
    return this.httpClient.get<SupplierModel[]>(this.suppliersUrl);
  }

  getWarehouses(): Observable<WarehouseModel[]> {
    return this.httpClient.get<WarehouseModel[]>(this.warehousesUrl);
  }

  getProducts(): Observable<ProductModel[]> {
    return this.httpClient.get<ProductModel[]>(this.productsUrl);
  }

  getVatRates(): Observable<VatRateModel[]> {
    return this.httpClient.get<VatRateModel[]>(this.vatRatesUrl);
  }

  getPurchaseOrderById(id: string): Observable<PurchaseOrderModel> {
    return this.httpClient.get<PurchaseOrderModel>(`${this.apiUrl}/${id}`);
  }
}
