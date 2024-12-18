import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { StockStatus } from '../../stock/stock-components/stock-status/stock-status.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Branch } from '../../setups/setups-components/branches/branches.component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { CommonModule } from '@angular/common';
import { AfterSaleActionsComponent } from './after-sale-actions/after-sale-actions.component';
import { StockBatch } from '../../stock/stock-components/stock-batch/stock-batch.component';

@Component({
  selector: 'app-after-sales',
  templateUrl: './after-sales.component.html',
  styleUrls: ['./after-sales.component.scss'],
  standalone: true,
  imports: [AgGridAngular, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AfterSalesComponent {
  user: any;
  displayedColumns: string[] = [
    'id',
    'imei',
    'model',
    'price',
    'agent',
    'customer',
    'status',
    'action',
  ];

  dataSource = [];
  phone!: any;
  isFetching!: boolean;
  dealerships: any[] = [];
  stockStatuses!: StockStatus[];
  branches: Branch[] = [];
  page: number = 0; size: number = 2000;
  RETRY_COUNT: number = 3;
  batches: StockBatch[] = [];
  totalPhonesSold!: number;
  totalPhonesSoldToday!: number;
  today: string = (new Date()).toLocaleDateString();

  rowData = [];
  gridApi!: GridApi;
  colDefs: ColDef[] = [
    { headerName: 'IMEI', field: 'stockImei', filter: true },
    { headerName: 'Model', field: 'stockModelName', filter: true },
    { headerName: 'Batch Number', field: 'stockBatchNo', filter: true },
    { headerName: 'Currency', field: 'stockCurrencyCode', filter: true },
    {
      headerName: 'Price',
      field: 'stockSellingPrice',
    },
    { headerName: 'Customer Name', field: 'stockCustomerName', filter: true },
    {
      headerName: 'Customer Phone Number',
      field: 'stockCustomerPhone',
      filter: true,
      cellRenderer: (params: any) =>
        `<a href="tel:${params.value}">${params.value}</a>`,
    },
    {
      headerName: 'Customer ID',
      field: 'stockCustomerNationalId',
      filter: true,
    },
    {
      headerName: 'Date Sold',
      field: 'stockUpdatedOn',
      filter: 'agDateColumnFilter',
      valueGetter: (params) => {
        const date = new Date(params.data.stockUpdatedOn); 
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
        }
      }
    },
    { headerName: 'Dealership', field: 'stockDealerShipName', filter: true },
    { headerName: 'Branch', field: 'stockBranchName', filter: true },
    { headerName: 'Agent', field: 'stockAgentName', filter: true },
    {
      headerName: 'Default Status',
      field: 'stockDefaulted',
      filter: true,
      cellRenderer: (params: any) => (params.value == 'Y' ? 'YES' : 'NO'),
    },
    {
      headerName: 'Actions',
      cellRenderer: AfterSaleActionsComponent,
      cellRendererParams: { update: this.updateStatus.bind(this) },
    },
  ];

  constructor(private data: DataService, public snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getUser();
    this.getPhones();
  }

  getPhones() {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.getAllStockDetails}?companyCode=${this.user.userCompanyCode}&page=${this.page}&size=${this.size}`;
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
            this.dataSource = this.dataSource.concat(res.data.content.filter(
              (phone: any) =>
                phone.stockCountryCode == this.user.userCountryCode
            ));
          } else if (role.toLowerCase().includes('region')) {
            this.dataSource = this.dataSource.concat(res.data.content.filter(
              (phone: any) => phone.stockRegionCode == this.user.userRegionCode
            ));
          } else {
            this.dataSource = this.dataSource.concat(res.data.content.filter(
              (phone: any) => phone.stockBranchCode == this.user.userBrnCode
            ));
          }
          this.rowData = this.dataSource;
          this.totalPhonesSold = res.data.totalElements;
          this.totalPhonesSoldToday = this.rowData.filter((phone: any) => (new Date(phone.stockUpdatedOn)).toLocaleDateString() == this.today).length;

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
            this.openSnackBar('Failed to fetch resources. Please refresh page.', 'Close');
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
          this.openSnackBar('Failed to fetch resources. Please refresh page.', 'Close');
        }
      }
    );
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = this.user.roleModel.roleName;
    if (
      !role.toLowerCase().includes('director') &&
      !role.toLowerCase().includes('admin')
    ) {
      this.colDefs = this.colDefs.filter(
        (column: any) =>
          !column.headerName.toLowerCase().includes('currency') &&
          !column.headerName.toLowerCase().includes('price')
      );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  updateStatus(phone: any) {
    const confirmed = confirm(
      `Are you sure you want to update ${
        phone.stockCustomerName.split(' ')[0]
      }'s default status to ${phone.stockDefaulted == 'N' ? 'YES' : 'NO'}?`
    );
    if (!confirmed) return;

    const endpoint: string = `${
      ENVIRONMENT.endpoints.stock.phone.updateDefaultStatus
    }?stockCode=${phone.stockCode}&defaultStatus=${
      phone.stockDefaulted == 'N' ? 'Y' : 'N'
    }`;
    this.isFetching = true;
    this.data.post(ENVIRONMENT.baseUrl + endpoint, {}).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          this.page = 0;
          this.dataSource = [];
          this.getPhones();
          this.openSnackBar('Default status updated successfully.', 'Close');
        } else {
          this.openSnackBar(res.message, 'Close');
        }
      },
      (error: any) => {
        this.isFetching = false;
        this.openSnackBar('Internal Server Error.', 'Close');
      }
    );
  }

  onBtnExport() {
    const params = {
      columnKeys: [
        'stockImei',
        'stockModelName',
        'stockBatchNo',
        'stockCurrencyCode',
        'stockSellingPrice',
        'stockCustomerName',
        'stockCustomerPhone',
        'stockCustomerNationalId',
        'stockUpdatedOn',
        'stockDealerShipName',
        'stockBranchName',
        'stockAgentName',
        'stockDefaulted',
      ],
    };
    this.gridApi.exportDataAsCsv(params);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  refresh() {
    this.page = 0;
    this.dataSource = [];
    this.getPhones();
  }

}
