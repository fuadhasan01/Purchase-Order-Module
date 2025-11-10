import { Component, OnInit } from '@angular/core';
import { PurchaseOrderModel } from '../../../features/purchase-order/models/purchase-order.model';
import { PurchaseOrderService } from '../../../features/purchase-order/services/purchase-order.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  purchaseOrders: PurchaseOrderModel[] = [];
  pendingOrdersCount = 0;

  constructor(private purchaseOrderService: PurchaseOrderService) {}

  ngOnInit(): void {
    this.purchaseOrderService.purchaseOrders$.subscribe((orders) => {
      this.purchaseOrders = orders;
      this.pendingOrdersCount = orders.filter((po) => po.status === 'Pending').length;
    });

    this.purchaseOrderService.loadPurchaseOrders();
  }

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }
}
