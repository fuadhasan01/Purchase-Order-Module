import { Component, OnInit } from '@angular/core';
import { PurchaseOrder } from '../../services/purchase-order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchase-order-list',
  standalone: true, // required if using 'imports' in Angular 20
  imports: [CommonModule],
  templateUrl: './purchase-order-list.html',
  styleUrls: ['./purchase-order-list.css'],
})
export class PurchaseOrderList implements OnInit {
  purchaseOrders: any[] = [];
  constructor(private purchaseOrderService: PurchaseOrder) {}

  ngOnInit(): void {
    this.purchaseOrderService.getPurchaseOrders().subscribe((data: any) => {
      console.log(data);
      this.purchaseOrders = data;
    });
  }
}
