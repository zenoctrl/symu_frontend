import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { StockStatus } from '../../stock/stock-components/stock-status/stock-status.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Branch } from '../../setups/setups-components/branches/branches.component';
import { MatTableDataSource } from '@angular/material/table';

import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, CsvExportModule } from 'ag-grid-community';
import { CommonModule } from '@angular/common';


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
  // dataSource = new MatTableDataSource<any>();
  dataSource = [];
  phone!: any;
  isFetching!: boolean;
  dealerships: any[] = [];
  stockStatuses!: StockStatus[];
  branches: Branch[] = [];
  rowData = [];
  gridApi!: GridApi;

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { headerName: 'IMEI', field: 'stockImei', filter: true },
    { headerName: 'Model', field: 'stockModelName', filter: true },
    { headerName: 'Currency', field: 'stockCurrencyCode' },
    { headerName: 'Price', field: 'stockSellingPrice' },
    { headerName: 'Customer Name', field: 'stockCustomerName', filter: true },
    {
      headerName: 'Customer Phone Number',
      field: 'stockCustomerPhone',
      filter: true,
    },
    {
      headerName: 'Customer ID',
      field: 'stockCustomerNationalId',
      filter: true,
    },
    { headerName: 'Dealership', field: 'stockDealerShipName', filter: true },
    { headerName: 'Branch', field: 'stockBranchName', filter: true },
    { headerName: 'Agent', field: 'stockAgentName', filter: true },
    { headerName: 'Default Status', field: 'stockDefaulted', filter: true },
  ];

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getUser();
    this.getPhones();
    this.getBranches();
  }

  getPhones() {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.getAllStockDetails}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          const role = this.user.roleModel.roleName;
          // this.dataSource.data = res.data;
          if (role.toLowerCase().includes('director')) {
            this.dataSource = res.data;
          } else if (
            role.toLowerCase().includes('admin') ||
            role.toLowerCase() == 'sales manager'
          ) {
            this.dataSource = res.data.filter(
              (phone: any) =>
                phone.stockCountryCode == this.user.userCountryCode
            );
          } else if (role.toLowerCase().includes('region')) {
            this.dataSource = res.data.filter(
              (phone: any) => phone.stockRegionCode == this.user.userRegionCode
            );
          } else {
            this.dataSource = res.data.filter(
              (phone: any) => phone.stockBranchCode == this.user.userBrnCode
            );
          }
          this.rowData = this.dataSource;
        } else {
          this.getPhones();
        }
      },
      (error: any) => {
        this.getPhones();
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
      // this.displayedColumns = this.displayedColumns.filter(
      //   (column: string) =>
      //     !column.includes('price') && !column.includes('action')
      // );
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

  getBranches() {
    this.branches = JSON.parse(sessionStorage.getItem('branches') || '[]');
  }

  getBranchName(code: string) {
    return this.branches.find((b) => b.code == code)?.name;
  }

  updateStatus(phone: any) {
    const confirmed = confirm(
      `Are you sure you want to update default to ${
        phone.stockDefaulted == 'N' ? 'YES' : 'NO'
      }?`
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
          this.getPhones();
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
    this.gridApi.exportDataAsCsv();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  export(data: any[]) {
    const filteredStockData = data.map((stock) => {
      const {
        stockBranchCode,
        stockRegionCode,
        stockCountryCode,
        stockCreatedOn,
        stockUpdatedOn,
        ...filteredStock
      } = stock;
      return filteredStock;
    });
    const csv = this.convertJSON2CSV(filteredStockData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales - ${new Date()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  convertJSON2CSV(data: any) {
    const keys = Object.keys(data[0]);
    const csvRows = [keys.join(',').toUpperCase().replaceAll('STOCK', '')];

    data.forEach((row: any) => {
      const values = keys.map((key) => {
        const escaped = ('' + row[key]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  }
}
