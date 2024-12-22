import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { PhoneModalComponent } from './phone-modal/phone-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { StockStatus } from '../stock-status/stock-status.component';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  CsvExportModule,
} from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { StockActionsComponent } from './stock-actions/stock-actions.component';

export interface Phone {
  id?: string;
  imei?: string;
  model?: string;
  memory?: string;
  price?: string;
  currency?: string;
}

@Component({
  selector: 'app-phone-list',
  templateUrl: './phone-list.component.html',
  styleUrls: ['./phone-list.component.scss'],
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PhoneListComponent {
  user: any;
  displayedColumns: string[] = [
    'id',
    'phone',
    'branch',
    'price',
    'status',
    'date',
    'action',
  ];
  dataSource = [];
  stockStatuses!: StockStatus[];
  phone!: any;
  isFetching!: boolean;
  dealerships: any[] = [];
  countries: Country[] = [];
  page: number = 0;
  size: number = 2000;
  RETRY_COUNT: number = 3;
  totalPhonesAvailableForSale!: number;
  permissionToEditDenied: boolean = false;

  rowData = [];
  gridApi!: GridApi;
  colDefs: ColDef[] = [
    { headerName: 'IMEI', field: 'stockImei', filter: true },
    { headerName: 'Model', field: 'stockMemory', filter: true },
    { headerName: 'Batch', field: 'stockBatchNumber', filter: true },
    {
      headerName: 'Branch',
      field: 'stockBranchName',
      filter: true,
    },
    {
      headerName: 'Cluster',
      field: 'stockClusterName',
      filter: true,
    },
    {
      headerName: 'Country',
      field: 'stockCountryName',
      filter: true,
    },
    {
      headerName: 'Status',
      field: 'stockStatusName',
      cellRenderer: (params: any) => params.value.toUpperCase(),
    },
    {
      headerName: 'Date',
      field: 'stockCreatedOn',
      filter: 'agDateColumnFilter',
      valueGetter: (params) => {
        const date = new Date(params.data.stockCreatedOn);
        return date.toLocaleDateString();
      },
      filterParams: {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: Date) => {
          const cellDate = new Date(cellValue);
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
          return 0;
        },
      },
    },
    {
      headerName: 'Actions',
      cellRenderer: StockActionsComponent,
      cellRendererParams: {
        update: this.editPhone.bind(this),
      },
    },
  ];

  @Output() postEvent = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUser();
    this.getPhones();
    this.getAllStockStatus();
    this.getDealerships();
    this.getCountries();
  }

  addPhone() {
    const dialogRef = this.dialog.open(PhoneModalComponent, {
      data: { phone: {}, title: 'Add Phone', user: this.user },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getPhones();
      }
    });
  }

  getPhones() {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.getAll}?companyCode=${this.user.userCompanyCode}&statusShortDesc=AVAILABLE&page=${this.page}&size=${this.size}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          const role = this.user.roleModel.roleName;
          if (role.toLowerCase().includes('director')) {
            this.dataSource = this.dataSource.concat(res.data.content);
          } else if (
            role.toLowerCase().includes('admin') ||
            role.toLowerCase() == 'sales manager'
          ) {
            this.dataSource = this.dataSource.concat(
              res.data.content.filter(
                (phone: any) =>
                  phone.stockCountryCode == this.user.userCountryCode
              )
            );
          } else if (role.toLowerCase().includes('region')) {
            this.dataSource = this.dataSource.concat(
              res.data.content.filter(
                (phone: any) =>
                  phone.stockRegionCode == this.user.userRegionCode
              )
            );
          } else if (
            role.toLowerCase().includes('shop') ||
            role.toLowerCase().includes('field')
          ) {
            this.dataSource = this.dataSource.concat(
              res.data.content.filter(
                (phone: any) => phone.stockBranchCode == this.user.userBrnCode
              )
            );
          } else {
            this.dataSource = this.dataSource.concat(
              res.data.content.filter(
                (phone: any) =>
                  phone.stockClusterCode == this.user.userClusterCode
              )
            );
          }
          this.rowData = this.dataSource;
          this.totalPhonesAvailableForSale = res.data.totalElements;

          // fetch some more if page is not last
          if (!res.data.last) {
            this.page++;
            this.getPhones();
          }
        } else {
          if (this.RETRY_COUNT > 0) {
            setTimeout(() => {
              this.getPhones();
              this.RETRY_COUNT--;
            }, 3000);
          } else {
            this.openSnackBar(
              'Failed to fetch resources. Please refresh page.',
              'Close'
            );
          }
        }
      },
      (error: any) => {
        if (this.RETRY_COUNT > 0) {
          setTimeout(() => {
            this.getPhones();
            this.RETRY_COUNT--;
          }, 3000);
        } else {
          this.openSnackBar(
            'Failed to fetch resources. Please refresh page.',
            'Close'
          );
        }
      }
    );
  }

  editPhone(event: any) {
    if (
      event.title.toLowerCase().includes('edit') &&
      this.permissionToEditDenied
    ) {
      this.openSnackBar('Permission denied.', 'Close');
      return;
    }

    const dialogRef = this.dialog.open(PhoneModalComponent, {
      data: {
        phone: event.phone,
        title: event.title,
        user: this.user,
        dealers: this.dealerships.filter(
          (d) => d.dealerCountryCode === event.phone.stockCountryCode
        ),
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dataSource = [];
        this.getPhones();
        if (res == 'posted') {
          this.postEvent.emit();
        }
      }
    });
  }

  viewReceipt(phone: any) {
    const dialogRef = this.dialog.open(PhoneModalComponent, {
      data: {
        phone: phone,
        title: 'Receipt',
        user: this.user,
      },
      disableClose: true,
    });
  }

  deletePhone(phone: any) {
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.delete}/${phone.id}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('Phone deleted successfully.', 'Close');
      this.getPhones();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getAllStockStatus() {
    this.stockStatuses = JSON.parse(
      sessionStorage.getItem('stock-status') || '{}'
    );
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = this.user.roleModel.roleName;
    if (
      !role.toLowerCase().includes('director') ||
      !role.toLowerCase().includes('admin')
    ) {
      this.displayedColumns = this.displayedColumns.filter(
        (column: string) => !column.includes('price')
      );
    }

    if (role.toLowerCase().includes('sales executive')) {
      this.permissionToEditDenied = true;
    }
  }

  getDealerships() {
    const endpoint: string = `${ENVIRONMENT.endpoints.dealership.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.dealerships = res.data;
        } else {
          this.getDealerships();
        }
      },
      (error: any) => {
        this.getDealerships();
      }
    );
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }

  transformDate(date: string) {
    return new Date(date).toLocaleString();
  }

  getBranch(id: number): string {
    return JSON.parse(sessionStorage.getItem('branches') || '[]').find(
      (b: any) => b.code == id
    ).name;
  }

  getCountry(id: number): string {
    return JSON.parse(sessionStorage.getItem('countries') || '[]').find(
      (b: any) => b.code == id
    ).countryName;
  }

  onBtnExport() {
    const params = {
      columnKeys: [
        'stockImei',
        'stockMemory',
        'stockBatchNumber',
        'stockBranchName',
        'stockClusterName',
        'stockCountryName',
        'stockStatusName',
        'stockCreatedOn',
      ],
    };
    this.gridApi.exportDataAsCsv(params);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
