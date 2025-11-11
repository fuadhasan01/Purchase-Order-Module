import { Component, OnInit } from '@angular/core';
import { PurchaseOrderModel } from '../../../features/purchase-order/models/purchase-order.model';
import { PurchaseOrderService } from '../../../features/purchase-order/services/purchase-order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  pendingOrdersCount = 0;

  constructor(private purchaseOrderService: PurchaseOrderService, private router: Router) {}

  ngOnInit(): void {
    this.purchaseOrderService.purchaseOrders$.subscribe((orders) => {
      // this.purchaseOrders = orders;
      this.pendingOrdersCount = orders.filter((po) => po.status === 'Pending').length;
    });

    this.purchaseOrderService.loadPurchaseOrders();
  }

  isActive(route: string): boolean {
    return window.location.pathname === route;
  }

  goToPendingOrders(): void {
    this.router.navigate(['/po/poList'], {
      queryParams: { status: 'Pending' },
    });
  }
}
