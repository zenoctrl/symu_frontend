import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { StockStatus } from '../stock-status.component';

@Component({
  selector: 'app-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.scss'],
})
export class StatusModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;

  constructor(
    public dialogRef: MatDialogRef<StatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  save() {
    if (this.data.stockStatus.statusCode === undefined) {
      this.createStockStatus(this.data.stockStatus);
    } else {
      this.updateStockStatus(this.data.stockStatus);
    }
  }

  createStockStatus(stockStatus: StockStatus) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.stockStatus.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, stockStatus).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.successMessage = 'Status added successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  updateStockStatus(stockStatus: StockStatus) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stockStatus.update}`;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, stockStatus).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.successMessage = 'Status updated successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }
}
