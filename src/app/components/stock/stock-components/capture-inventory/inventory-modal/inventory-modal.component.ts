import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { Branch } from 'src/app/components/setups/setups-components/branches/branches.component';
import { DeviceModel } from '../../phone-models/phone-models.component';
import { StockBatch } from '../../stock-batch/stock-batch.component';
import { Cluster } from 'cluster';

@Component({
  selector: 'app-inventory-modal',
  templateUrl: './inventory-modal.component.html',
  styleUrls: ['./inventory-modal.component.scss'],
})
export class InventoryModalComponent {
  user: any;
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  branches!: Branch[];
  models!: DeviceModel[];
  batches: StockBatch[] = [];
  _models: DeviceModel[] = [];
  _batches: StockBatch[] = [];
  IMEI: any;
  CAPTURED_IMEI: string[] = [];
  VIEW_CAPTURED_IMEI: boolean = false;
  SOME_FAILED_INSERT: boolean = false;
  STOCK_ADDED: boolean = false;
  REASON_FOR_FAILURE: string[] = [];
  clusters!: Cluster[] | any;

  constructor(
    public dialogRef: MatDialogRef<InventoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  ngOnInit() {
    this.getBranches();
    this.getDeviceModels();
    this.getAllStockBatch();
  }

  getBranches() {
    this.branches = JSON.parse(sessionStorage.getItem('branches') || '[]').sort((a: any, b: any) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role: string = user.roleModel.roleName.toLowerCase();
    if (!role.toLowerCase().includes('director')) {
      this.branches = this.branches.filter(b => b.countryCode == user.userCountryCode);
    }
  }

  getClusters() {
    this.errorMessage = '';
    const endpoint: string = `${ENVIRONMENT.endpoints.clusters.getAll}?clusterBranchCode=${this.data.stock.stockBranchCode}`;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.clusters = res.data.filter(
            (cluster: Cluster | any) =>
              cluster.clusterStatus.toUpperCase() == 'ACTIVE'
          );
          if (this.clusters.length == 0) {
            this.errorMessage = 'Selected branch has no cluster.';
          }
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

  getDeviceModels() {
    const endpoint: string = ENVIRONMENT.endpoints.phoneModels.getAll;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.models = res.data.filter(
            (model: DeviceModel) => model.modelStatus == 'AVAILABLE'
          ).sort((a: any, b: any) => {
            if (a.modelName.toLowerCase() < b.modelName.toLowerCase()) return -1;
            if (a.modelName.toLowerCase() > b.modelName.toLowerCase()) return 1;
            return 0;
          });
        }
      },
      (error: any) => {}
    );
  }

  getAllStockBatch() {
    const endpoint: string = ENVIRONMENT.endpoints.stock.batch.getAll;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.batches = res.data;
        }
      },
      (error: any) => {}
    );
  }

  filterModels() {
    this._models = this.models.filter(
      (model: DeviceModel) =>
        model.modelCountryCode ==
        this.branches.find(
          (branch) => branch.code === this.data.stock.stockBranchCode
        )?.countryCode
    );
  }

  filterBatches() {
    this._batches = this.batches.filter(
      (batch: StockBatch) =>
        batch.stockModelCode == this.data.stock.stockModelCode &&
        batch.batchStatus == 'AVAILABLE'
    ).sort((a: any, b: any) => {
      if (a.batchDate.toLowerCase() < b.batchDate.toLowerCase()) return 1;
      if (a.batchDate.toLowerCase() > b.batchDate.toLowerCase()) return -1;
      return 0;
    });;
    if (this._batches.length > 0) {
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Model has no available batch.';
    }
  }

  onClose(string?: any) {
    this.dialogRef.close(string);
  }

  save() {
    this.data.stock.stockCreatedBy = this.data.user.code;
    this.data.stock.stockImei = this.CAPTURED_IMEI;
    this.loading = true;
    this.errorMessage = this.successMessage = '';
    const endpoint: string = ENVIRONMENT.endpoints.stock.bulk.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, this.data.stock).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          if (res.data.length > 0) this.export(res.data);

          if (res.success > 0 && res.failed == 0) {
            this.successMessage = `${res.success} added successfully.`;
            this.STOCK_ADDED = true;
            this.data.stock.stockBranchCode =
              this.data.stock.stockClusterCode =
              this.data.stock.stockModelCode =
                this.data.stock.stockBatchCode = null;
                this.CAPTURED_IMEI = [];
            setTimeout(() => {
              this.successMessage = '';
              this.onClose('success');
            }, 3000);
          }

          if (res.success > 0 && res.failed > 0) {
            this.SOME_FAILED_INSERT = this.STOCK_ADDED = true;
            this.successMessage = `Saved ${res.success} successfully. But failed to save ${res.failed}.`;
            this.REASON_FOR_FAILURE = res.symuErrorInfoList.map(
              (error: any) => `${error.statusDesc} -  ${error.statusMessage}`
            );
          }

          if (res.success == 0 && res.failed > 0) {
            this.SOME_FAILED_INSERT = true;
            this.errorMessage = `Failed to save any of the IMEI.`;
            this.REASON_FOR_FAILURE = res.symuErrorInfoList.map(
              (error: any) => `${error.statusDesc} -  ${error.statusMessage}`
            );
          }
        } else {
          this.errorMessage = res.symuErrorInfoList.map(
            (error: any) => `${error.statusDesc} - ${error.statusMessage}`
          );
        }
      },
      (error: any) => {
        this.loading = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  capture() {

    this.errorMessage = isNaN(Number(this.IMEI))
      ? 'Wrong IMEI input value'
      : '';

    if (!this.CAPTURED_IMEI.includes(this.IMEI) && /^\d{15}$/.test(this.IMEI)) {
      this.CAPTURED_IMEI.push(this.IMEI);
      this.IMEI = '';
    }
  }

  viewCapturedIMEI() {
    if (this.CAPTURED_IMEI.length == 0) return;
    this.VIEW_CAPTURED_IMEI = !this.VIEW_CAPTURED_IMEI;
  }

  export(data: any[]) {
    const filteredStockData = data.map((stock) => {
      const {
        code,
        stockCompanyCode,
        stockBatchCode,
        stockBranchCode,
        stockRegionCode,
        stockCountryCode,
        stockCreatedOn,
        stockUpdatedOn,
        stockAgnCode,
        stockModelCode,
        stockMemory,
        stockBuyingPrice,
        stockSellingPrice,
        stockProfit,
        stockStatusCode,
        stockBaseCurrency,
        stockDefaulted,
        stockCustomerCode,
        stockCreatedBy,
        stockUpdatedBy,
        stockSoldBy,
        stockTradeName,
        stockDealerCode,
        stockStatusDescription,
        stockStatusName,
        statusShortDesc,
        stockBranchName,
        stockCountryName,
        stockBatchNumber,
        stockClusterCode,
        ...filteredStock
      } = stock;
      return filteredStock;
    });
    const csv = this.convertJSON2CSV(filteredStockData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `PHONE_IMEI_${new Date()}.csv`;
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

  removeIMEI(IMEI: string) {
    this.CAPTURED_IMEI = this.CAPTURED_IMEI.filter((imei: string) => imei != IMEI);
  }
}
