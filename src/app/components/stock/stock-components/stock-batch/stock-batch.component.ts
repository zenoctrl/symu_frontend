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
  displayedColumns: string[] = [
    'id',
    'number',
    'model',
    // 'price',
    'total',
    'status',
    'date',
    'action',
  ];
  dataSource = new MatTableDataSource<StockBatch[]>();
  isFetching!: boolean;
  user: any;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getUser();
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
          const role = this.user.roleModel.roleName;
          const batches = res.data.reverse();
          if (role.toLowerCase().includes('director')) {
            this.dataSource.data = batches;
          } else {
            this.dataSource.data = batches.filter(
              (batch: any) =>
                batch.stockBatchCountryCode == this.user.userCountryCode
            );
          }
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

  viewStockDetails(stockBatch: StockBatch) {
    const dialogRef = this.dialog.open(BatchModalComponent, {
      data: { stockBatch: stockBatch, title: `Batch Details - #${stockBatch.batchNo}` },
      disableClose: true,
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

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = this.user.roleModel.roleName;
    if (
      !role.toLowerCase().includes('director') &&
      !role.toLowerCase().includes('admin')
    ) {
      this.displayedColumns = this.displayedColumns.filter(
        (column: string) =>
          !column.includes('price') && !column.includes('action')
      );
    }
  }

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }
}
