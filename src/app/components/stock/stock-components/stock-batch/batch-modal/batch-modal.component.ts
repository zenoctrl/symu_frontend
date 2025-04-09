import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DeviceModel } from '../../phone-models/phone-models.component';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';
import { StockBatch } from '../stock-batch.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  fetchingStatistics!: boolean;
  stats: any;
  viewStock: boolean = false;
  fetchingStock: boolean = false;
  phones: any[] = [];
  stockStatus: any;
  displayedColumns: string[] = [
    'id',
    'imei',
    'cluster',
    'branch'
  ];
  dataSource = new MatTableDataSource<any[]>();
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<BatchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  ngOnInit() {
    this.getCountries();
    this.getDeviceModels();
    this.getUser();
    if (this.data.title.toLowerCase().includes('details')) {
      this.getStatistics(this.data.stockBatch.code);
    }
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
    // if (this.user.roleModel.roleName.toLowerCase().includes('admin')) {
    //   this.data.stockBatch.stockBatchCountryCode = this.user.countryEntity.code;
    //   this.data.stockBatch.stockBatchCurrencyCode =
    //     this.user.countryEntity.countryCurrencyCode;
    //   this._models = this.models.filter(
    //     (m) =>
    //       m.modelCountryCode === this.data.stockBatch.stockBatchCountryCode &&
    //       m.modelStatus?.toLowerCase().includes('available')
    //   );
    // }
    this.data.stockBatch.stockBatchCountryCode = this.user.userCountryCode;
    this.data.stockBatch.stockBatchCurrencyCode = this.countries.find(c => c.code == this.user.userCountryCode)?.countryCurrencyCode;
    this._models = this.models.filter(
      (m) =>
        m.modelCountryCode === this.data.stockBatch.stockBatchCountryCode &&
        m.modelStatus?.toLowerCase().includes('available')
    );
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }

  getDeviceModels() {
    this.models = JSON.parse(sessionStorage.getItem('models') || '[]');
  }

  selectCountry() {
    this._models = this.models.filter(
      (m) => m.modelCountryCode === this.data.stockBatch.stockBatchCountryCode &&
          m.modelStatus?.toLowerCase().includes('available')
    );
    this.data.stockBatch.stockBatchCurrencyCode = this.countries.find(
      (c) => c.code === this.data.stockBatch.stockBatchCountryCode
    )?.countryCurrencyCode;
    this.data.stockBatch.stockModelCode =
      this.data.stockBatch.batchBuyingPrice = null;
  }

  getStatistics(code: number) {
    this.fetchingStatistics = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.batch.getStatistics}?stockBatchCode=${code}`;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.fetchingStatistics = false;
        if (res.statusCode == 0) {
          this.stats = res.data;
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        this.fetchingStatistics = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  getStock(stockStatusName: any) {
    this.viewStock = true;
    this.fetchingStock = true;
    const status = JSON.parse(sessionStorage.getItem('stock-statuses') || '[]').find((s: any) => s.statusName == stockStatusName);
    this.stockStatus = status;
    let countryCode = this.user.roleModel.roleName.toLowerCase().includes('director') ? null : this.user.userCountryCode;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.getAll}?companyCode=${this.user.userCompanyCode}&stockCountryCode=${countryCode}&stockRegionCode=${this.user.userRegionCode}&stockBranchCode=${this.user.userBrnCode}&stockClusterCode=${this.user.userClusterCode}&statusShortDesc=${status.statusShortDesc}&stockBatchCode=${this.data.stockBatch.code}&page=0&size=2000`;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.fetchingStock = false;
        if (res.statusCode == 0) {
          this.dataSource.data = res.data.content;
          this.dataSource.paginator = this.paginator;
        } else {

        }
      },
      (error: any) => {
        this.fetchingStock = false;
      }
    );
  }

  back() {
    this.viewStock = false;
    this.dataSource.data = [];
  }

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }

  transformDate(date: string) {
    return (new Date(date)).toDateString();
  }
}
