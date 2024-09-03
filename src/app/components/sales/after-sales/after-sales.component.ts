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
import { MatTableDataSource } from '@angular/material/table';

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
  dataSource = new MatTableDataSource<any>();
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
          this.dataSource.data = res.data;
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
    if (!role.toLowerCase().includes('admin')) {
      this.displayedColumns = this.displayedColumns.filter(
        (column: string) =>
          !column.includes('price') && !column.includes('action')
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

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }

  export(data: any) {
    const csv = this.convertJSON2CSV(data);
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
