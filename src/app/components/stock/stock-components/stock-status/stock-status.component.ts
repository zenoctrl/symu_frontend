import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { StatusModalComponent } from './status-modal/status-modal.component';

export interface StockStatus {
  statusCode?: string;
  statusName?: string;
  statusShortDesc?: string;
  statusDescription?: string;
}

@Component({
  selector: 'app-stock-status',
  templateUrl: './stock-status.component.html',
  styleUrls: ['./stock-status.component.scss'],
})
export class StockStatusComponent {
  displayedColumns: string[] = ['id', 'description', 'tag'];
  dataSource!: StockStatus[];
  isFetching!: boolean;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getAllStockStatus();
  }

  addStockStatus() {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      data: { stockStatus: {}, title: 'Add Stock Status' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getAllStockStatus();
      }
    });
  }

  getAllStockStatus() {
    this.isFetching = true;
    const endpoint: string = ENVIRONMENT.endpoints.stockStatus.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('stock-status', JSON.stringify(res.data));
          this.dataSource = res.data;
        } else {
        }
      },
      (error: any) => {
        this.isFetching = false;
      }
    );
  }

  editStockStatus(stockStatus: StockStatus) {
    const dialogRef = this.dialog.open(StatusModalComponent, {
      data: { stockStatus: stockStatus, title: 'Edit Stock Status' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getAllStockStatus();
      }
    });
  }

  deleteStockStatus(stockStatus: StockStatus) {
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.stockStatus.delete}/${stockStatus.statusCode}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('Status deleted successfully.', 'Close');
      this.getAllStockStatus();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
