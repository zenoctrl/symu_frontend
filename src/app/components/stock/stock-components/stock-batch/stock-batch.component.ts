import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { BatchModalComponent } from './batch-modal/batch-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface StockBatch {
  code?: string;
  batchNo?: string;
  batchName?: string;
  batchShortDesc?: string;
  batchDescription?: string;
  batchStatus?: string;
  stockModelCode?: string;
  stockBatchCompanyCode?: string;
  stockBatchCountryCode?: string;
  batchBuyingPrice?: string;
  countryEntity?: any;
  modelEntity?: any;
  batchDate?: any;
}

@Component({
  selector: 'app-stock-batch',
  templateUrl: './stock-batch.component.html',
  styleUrls: ['./stock-batch.component.scss'],
})
export class StockBatchComponent {
  displayedColumns: string[] = ['id', 'number', 'model', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource<StockBatch[]>();
  isFetching!: boolean;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getAllStockBatch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addStockBatch() {
    const dialogRef = this.dialog.open(BatchModalComponent, {
      data: { stockBatch: {}, title: 'Add Batch' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getAllStockBatch();
      }
    });
  }

  getAllStockBatch() {
    this.isFetching = true;
    const endpoint: string = ENVIRONMENT.endpoints.stock.batch.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('stock-batches', JSON.stringify(res.data));
          this.dataSource = res.data;
          this.dataSource.paginator = this.paginator;
        } else {
        }
      },
      (error: any) => {
        this.isFetching = false;
      }
    );
  }

  editStockBatch(stockBatch: StockBatch) {
    const dialogRef = this.dialog.open(BatchModalComponent, {
      data: { stockBatch: stockBatch, title: 'Edit Batch' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getAllStockBatch();
      }
    });
  }

  deleteDeviceModel(stockBatch: StockBatch) {
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.batch.delete}/${stockBatch.code}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('Batch deleted successfully.', 'Close');
      this.getAllStockBatch();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
