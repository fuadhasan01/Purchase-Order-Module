import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { PurchaseOrderListDto } from '../../models/po-list.dto';

@Component({
  selector: 'app-purchase-order-list',
  standalone: false,
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css'],
})
export class PurchaseOrderListComponent implements OnInit {
  purchaseOrders$!: Observable<PurchaseOrderListDto[]>;
  allPurchaseOrders: PurchaseOrderListDto[] = [];

  // For filtering
  searchTerm: string = '';
  selectedStatus: string = '';
  startDate: any = null;
  endDate: any = null;

  // From ng bootstrap datepicker
  dateRange: (Date | undefined)[] | undefined = undefined;

  // For sorting
  sortColumn: string = 'poNumber';
  sortDirection: 'asc' | 'desc' = 'asc';

  // For pagination
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private purchaseOrderService: PurchaseOrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.selectedStatus = params['status'] || '';
      this.sortColumn = params['sortColumn'] || 'poNumber';
      this.sortDirection = params['sortDirection'] || 'asc';
      this.currentPage = +params['page'] || 1;

      this.startDate = params['startDate'] ? new Date(params['startDate']) : null;
      this.endDate = params['endDate'] ? new Date(params['endDate']) : null;

      this.fetchPurchaseOrders();
    });
  }

  fetchPurchaseOrders(): void {
    this.purchaseOrderService.getPurchaseOrdersWithDetails().subscribe({
      next: (data) => {
        this.allPurchaseOrders = data;
        this.renderList();
      },
      error: (error) => {
        console.error('Error fetching purchase orders', error);
      },
    });
  }

  // combined filtering logic
  renderList(): void {
    let filtered = [...this.allPurchaseOrders];
    let list = this.applySearch(filtered);
    list = this.applyStatusFilter(list);
    list = this.applyDateFilter(list);
    list = this.applySorting(list);
    this.totalItems = filtered.length;
    list = this.applyPagination(list);

    this.purchaseOrders$ = of(list);
  }

  // search filter method
  private applySearch(list: PurchaseOrderListDto[]): PurchaseOrderListDto[] {
    if (!this.searchTerm.trim()) return list;

    const text = this.searchTerm.toLowerCase();
    return list.filter(
      (x) =>
        x.poNumber.toLowerCase().includes(text) ||
        x.supplierName?.toLowerCase().includes(text) ||
        x.warehouseName?.toLowerCase().includes(text)
    );
  }

  // status filter method
  private applyStatusFilter(list: PurchaseOrderListDto[]): PurchaseOrderListDto[] {
    if (!this.selectedStatus) return list;
    return list.filter((x) => x.status === this.selectedStatus);
  }

  // date range filter method
  private applyDateFilter(list: PurchaseOrderListDto[]): PurchaseOrderListDto[] {
    if (!this.startDate || !this.endDate) return list;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    return list.filter((x) => {
      const date = new Date(x.orderDate);
      return date >= start && date <= end;
    });
  }

  // sorting method
  private applySorting(list: PurchaseOrderListDto[]): PurchaseOrderListDto[] {
    const dir = this.sortDirection === 'asc' ? 1 : -1;

    return list.sort((a: any, b: any) => {
      const valA = a[this.sortColumn];
      const valB = b[this.sortColumn];

      if (valA === valB) return 0;
      return valA > valB ? dir : -dir;
    });
  }

  // pagination method
  private applyPagination(list: PurchaseOrderListDto[]): PurchaseOrderListDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm || null,
        status: this.selectedStatus || null,
        startDate: this.startDate ? this.startDate.toISOString() : null,
        endDate: this.endDate ? this.endDate.toISOString() : null,
        sortColumn: this.sortColumn,
        sortDirection: this.sortDirection,
        page: this.currentPage,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.updateQueryParams();
  }

  onDateRangeChange(range: (Date | undefined)[] | undefined): void {
    if (range && range[0] && range[1]) {
      this.startDate = range[0];
      this.endDate = range[1];
    } else {
      this.startDate = null;
      this.endDate = null;
    }
    this.currentPage = 1;
    this.updateQueryParams();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.updateQueryParams();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParams();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.dateRange = undefined;
    this.startDate = null;
    this.endDate = null;
    this.currentPage = 1;
    this.updateQueryParams();
  }

  goToPoCreate(): void {
    this.router.navigate(['/po/poCreate']);
  }

  editPo(poId: string): void {
    this.router.navigate(['/po/poEdit', poId]);
  }

  deletePo(poId: string): void {
    if (confirm('Are you sure you want to delete this Purchase Order?')) {
      this.purchaseOrderService.deletePurchaseOrder(poId).subscribe(() => {
        alert('Purchase Order deleted successfully.');
        this.fetchPurchaseOrders();
      });
    }
  }
}
