import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseOrderModel } from '../../models/purchase-order.model';
import { Observable, of } from 'rxjs';
import { PurchaseOrderService } from '../../services/purchase-order.service';

@Component({
  selector: 'app-purchase-order-list',
  standalone: false,
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css'],
})
export class PurchaseOrderListComponent implements OnInit {
  Math = Math; // Expose Math to template
  purchaseOrders$: Observable<PurchaseOrderModel[]> = of([]);
  allPurchaseOrders: PurchaseOrderModel[] = [];

  searchTerm: string = '';
  selectedStatus: string = '';
  startDate: any = null;
  endDate: any = null;

  sortColumn: string = 'poNumber';
  sortDirection: 'asc' | 'desc' = 'asc';

  // pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private purchaseOrderService: PurchaseOrderService, private router: Router) {
    this.purchaseOrders$ = this.purchaseOrderService.getPurchaseOrders();
  }

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders(): void {
    this.purchaseOrderService.getPurchaseOrders().subscribe((data) => {
      this.allPurchaseOrders = data;
      this.applyFilters();
    });
  }

  goToPoCreate(): void {
    this.router.navigate(['/poCreate']);
  }

  // Combined filtering logic
  applyFilters(): void {
    let filtered = [...this.allPurchaseOrders];

    // search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (po) =>
          po.poNumber.toLowerCase().includes(term) ||
          po.supplierId.toString().includes(term) ||
          po.warehouseId.toString().includes(term)
      );
    }

    // status filter
    if (this.selectedStatus) {
      filtered = filtered.filter((po) => po.status === this.selectedStatus);
    }

    // date range filter
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      filtered = filtered.filter((po) => {
        const orderDate = new Date(po.orderDate);
        return orderDate >= start && orderDate <= end;
      });
    }

    // sorting
    filtered = filtered.sort((a, b) => {
      const aVal = (a as any)[this.sortColumn];
      const bVal = (b as any)[this.sortColumn];
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // pagination
    this.totalItems = filtered.length;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const paged = filtered.slice(startIndex, endIndex);

    this.purchaseOrders$ = of(paged);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  // Add this property
  dateRange: (Date | undefined)[] | undefined = undefined;

  onDateRangeChange(range: (Date | undefined)[] | undefined): void {
    if (range && range[0] && range[1]) {
      // Convert to actual start/end dates
      this.startDate = range[0];
      this.endDate = range[1];
    } else {
      this.startDate = '';
      this.endDate = '';
    }
    this.currentPage = 1;
    this.applyFilters();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFilters();
  }
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.dateRange = undefined;
    this.startDate = null;
    this.endDate = null;
    this.currentPage = 1;
    this.applyFilters();
  }

  deletePo(poId: number): void {
    if (confirm('Are you sure you want to delete this Purchase Order?')) {
      this.purchaseOrderService.deletePurchaseOrder(poId).subscribe(() => {
        alert('Purchase Order deleted successfully.');
        this.loadPurchaseOrders();
      });
    }
  }
}
