import { Component } from '@angular/core';
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

@Component({
  selector: 'app-after-sales',
  templateUrl: './after-sales.component.html',
  styleUrls: ['./after-sales.component.scss'],
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
  dataSource!: any[];
  phone!: any;
  isFetching!: boolean;
  dealerships: any[] = [];
  stockStatuses!: StockStatus[];
  branches: Branch[] = [];

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
          this.dataSource = res.data;
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
    this.isFetching = true;
    const endpoint: string = `${
      ENVIRONMENT.endpoints.stock.phone.updateDefaultStatus
    }?stockCode=${phone.code}&defaultStatus=${
      phone.stockDefaulted == 'N' ? 'Y' : 'N'
    }`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          this.getPhones();
        } else {
          this.openSnackBar(res.message, 'Close');
        }
      },
      (error: any) => {
        this.openSnackBar('Internal Server Error.', 'Close');
      }
    );
  }

  export() {}

  viewAgent() {}

  viewClient() {}
}
