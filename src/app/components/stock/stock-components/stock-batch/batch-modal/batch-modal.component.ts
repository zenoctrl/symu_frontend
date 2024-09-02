import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DeviceModel } from '../../phone-models/phone-models.component';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';
import { StockBatch } from '../stock-batch.component';

@Component({
  selector: 'app-batch-modal',
  templateUrl: './batch-modal.component.html',
  styleUrls: ['./batch-modal.component.scss'],
})
export class BatchModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  user: any;
  countries: Country[] = [];
  models: DeviceModel[] = [];
  _models: DeviceModel[] = [];
  statuses: string[] = ['AVAILABLE', 'COMPLETED'];

  constructor(
    public dialogRef: MatDialogRef<BatchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {
    this.getUser();
    this.getCountries();
    this.getDeviceModels();
  }

  save() {
    this.data.stockBatch.stockBatchCompanyCode = this.user.userCompanyCode;
    this.data.stockBatch.batchName =
      this.data.stockBatch.batchShortDesc =
      this.data.stockBatch.batchDescription =
        this.data.stockBatch.batchNo;

    if (this.data.stockBatch.code === undefined) {
      this.createStockBatch(this.data.stockBatch);
    } else {
      this.updateStockBatch(this.data.stockBatch);
    }
  }

  createStockBatch(stockBatch: StockBatch) {
    stockBatch.batchDate = new Date();
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.stock.batch.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, stockBatch).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.successMessage = 'Batch added successfully.';
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

  updateStockBatch(stockBatch: StockBatch) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.batch.update}`;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, stockBatch).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.successMessage = 'Batch updated successfully.';
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

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }

  getDeviceModels() {
    this.models = JSON.parse(sessionStorage.getItem('models') || '[]');
  }

  selectCountry() {
    this._models = this.models.filter(
      (m) => m.modelCountryCode === this.data.stockBatch.stockBatchCountryCode
    );
    this.data.stockBatch.stockBatchCurrencyCode = this.countries.find(
      (c) => c.code === this.data.stockBatch.stockBatchCountryCode
    )?.countryCurrencyCode;
    this.data.stockBatch.stockModelCode =
      this.data.stockBatch.batchBuyingPrice = null;
  }
}
