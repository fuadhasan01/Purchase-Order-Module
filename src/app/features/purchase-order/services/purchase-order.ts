import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrder {
  private apiUrl = 'http://localhost:3000/purchaseOrders';
  constructor(private httpClient: HttpClient) {}
  getPurchaseOrders() {
    return this.httpClient.get(this.apiUrl);
  }
}
