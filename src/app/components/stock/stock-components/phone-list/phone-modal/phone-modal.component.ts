import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DeviceModel } from '../../phone-models/phone-models.component';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';
import { Region } from 'src/app/components/setups/setups-components/regions/regions.component';
import { Branch } from 'src/app/components/setups/setups-components/branches/branches.component';
import { StockBatch } from '../../stock-batch/stock-batch.component';

@Component({
  selector: 'app-phone-modal',
  templateUrl: './phone-modal.component.html',
  styleUrls: ['./phone-modal.component.scss'],
})
export class PhoneModalComponent {
  models!: DeviceModel[];
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  scanning!: boolean;
  countries!: Country[];
  regions!: Region[];
  branches!: Branch[];
  user: any;
  fetchingReceipt: any;
  receipt: any;
  batches: StockBatch[] = [];
  userAssignedToBranch!: boolean;
  inValidIMEI!: boolean;

  constructor(
    public dialogRef: MatDialogRef<PhoneModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  ngOnInit() {
    // if (this.data.phone.stockImei === undefined) {
    //   this.scanning = true;
    // } else {
    //   this.scanning = false;
    // }
    this.getUser();

    if (this.data.title === 'Edit Phone' || this.data.title === 'Post Sale') {
      this.getRegions();
      this.getBranches();
      this.getModels();
      this.getBatch();
    }
    
    if (this.data.title === 'Receipt') {
      this.fetchReceipt(this.data.phone);
    }
  }

  save() {
    if (this.data.phone.code === undefined) {
      this.createPhone(this.data.phone);
    } else {
      if (this.data.title.toLowerCase().includes('edit')) {
        this.updatePhone(this.data.phone);
      } else if (this.data.title.toLowerCase().includes('price')) {
        this.updatePrice(this.data.phone);
      } else if (this.data.title.toLowerCase().includes('post')) {
        this.postSale(this.data.phone);
      } else {
        this.completeSale(this.data.phone);
      }
    }
  }

  createPhone(phone: any) {
    this.errorMessage = '';
    if (this.data.phone.stockImei.length < 15) {
      this.errorMessage = 'IMEI entered has less than 15 digits.';
      return;
    }
    const payload = {
      stockCompanyCode: this.user.userCompanyCode,
      stockCountryCode: this.data.phone.stockCountryCode,
      stockRegionCode: this.data.phone.stockRegionCode,
      stockBranchCode: this.data.phone.stockBranchCode,
      stockImei: this.data.phone.stockImei,
      stockModelCode: this.data.phone.stockModelCode,
      stockMemory: this.data.phone.stockMemory,
      stockBaseCurrency: this.data.phone.stockBaseCurrency,
      stockStatusCode: 2, // set to available (price has been set already on model & batch)
      stockCreatedBy: this.user.code,
      stockBatchCode: this.data.phone.stockBatchCode,
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.stock.phone.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Phone saved successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
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

  updatePhone(phone: any) {
    this.errorMessage = '';
    if (this.data.phone.stockImei.length < 15) {
      this.errorMessage = 'IMEI entered has less than 15 digits.';
      return;
    }
    const payload = {
      code: this.data.phone.code,
      stockCompanyCode: this.user.userCompanyCode,
      stockCountryCode: this.data.phone.stockCountryCode,
      stockRegionCode: this.data.phone.stockRegionCode,
      stockBranchCode: this.data.phone.stockBranchCode,
      stockImei: this.data.phone.stockImei,
      stockModelCode: this.data.phone.stockModelCode,
      stockMemory: this.data.phone.stockMemory,
      stockBaseCurrency: this.data.phone.stockBaseCurrency,
      stockStatusCode: 2, // set to available (price has been set already on model & batch)
      stockCreatedBy: this.data.phone.stockCreatedBy,
      stockUpdatedBy: this.user.code,
      stockBatchCode: this.data.phone.stockBatchCode,
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.stock.phone.update;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Phone saved successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
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

  updatePrice(phone: any) {
    const payload = {
      stockCode: phone.code,
      userCode: this.user.code,
      statusCode: 2, // moved to available.
      buyingPrice: phone.stockBuyingPrice,
      sellingPrice: phone.stockSellingPrice,
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.stock.phone.setPrice;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Price updated successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
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

  postSale(phone: any) {
    const payload = {
      stockCode: phone.code,
      userCode: this.user.code,
      nextStatusCode: 3, // moved to posted a sale
      tradingName: phone.tradingName,
      customerNationalId: phone.customerNationalId,
      customerName: phone.customerName,
      customerPhoneNumber: phone.customerPhoneNumber,
      stockDealerCode: this.data.dealers.find((d: any) => d.dealerName == phone.tradingName).dealerCode,
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.stock.phone.postSale;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.data.title = "Receipt";
          this.receipt = res.data;
        } else {
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

  completeSale(phone: any) {
    const payload = {
      stockCode: phone.code,
      userCode: this.user.code,
      nextStatusCode: 4, // moved to sold
      agentName: phone.agentName,
      agentPhoneNumber: phone.agentPhoneNumber,
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.stock.phone.closeSale;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Sale completed successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('posted');
          }, 1500);
        } else {
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

  fetchReceipt(phone: any) {
    this.fetchingReceipt = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.queryReceipt}?stockCode=${phone.code}`;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.fetchingReceipt = false;
        if (res.statusCode == 0) {
          this.receipt = res.data[0];
        } else {
        }
      },
      (error: any) => {
        this.fetchingReceipt = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  onClose(string?:any) {
    this.dialogRef.close(string);
  }

  scanSuccessHandler(result: any) {
    this.data.phone.stockImei = result;
    this.scanning = false;
  }

  getModels() {
    this.models = JSON.parse(sessionStorage.getItem('models') || '[]').filter(
      (model: DeviceModel) => model.modelStatus == 'AVAILABLE' && model.modelCountryCode == this.data.phone.stockCountryCode
    );
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }

  selectModel() {
    this.data.phone.stockModelCode = this.models.find(
      (model: DeviceModel) => model.modelName === this.data.phone.stockMemory
    )?.code;
    this.getBatch();
  }

  getBatch() {
    this.batches = JSON.parse(
      sessionStorage.getItem('stock-batches') || '[]'
    ).filter(
      (batch: StockBatch) =>
        batch.stockModelCode == this.data.phone.stockModelCode
    );
    if (this.batches.length > 0) {
      this.errorMessage = '';
    } else {
      this.errorMessage = "Selected model has no batch number.";
    }
    
  }

  selectCountry() {
    this.data.phone.stockBaseCurrency = this.countries.find(
      (country: Country) => country.code === this.data.phone.stockCountryCode
    )?.countryCurrencyCode;
    this.data.phone.stockRegionCode = this.data.phone.stockBranchCode = this.data.phone.stockMemory = null;
    this.getModels();
    this.getRegions();
  }

  getRegions() {
    this.regions = JSON.parse(
      sessionStorage.getItem('regions') || '[]'
    ).filter(
      (region: Region) => region.regionCountryCode === this.data.phone.stockCountryCode
    );
  }

  getBranches() {
    this.branches = JSON.parse(
      sessionStorage.getItem('branches') || '[]'
    ).filter(
      (branch: Branch) => branch.regionCode === this.data.phone.stockRegionCode
    );
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.getCountries();
    const role = this.user.roleModel.roleName;
    if (role.toLowerCase().includes('admin')) {
      this.data.phone.stockCountryCode = this.user.userCountryCode;
      this.selectCountry();
    } else if (
      role.toLowerCase() == 'shop manager' ||
      role.toLowerCase() == 'field sales manager'
    ) {
      this.userAssignedToBranch = true;
      this.data.phone.stockCountryCode = this.user.userCountryCode;
      this.data.phone.stockRegionCode = this.user.userRegionCode;
      this.data.phone.stockBranchCode = this.user.userBrnCode;
    }
    this.getModels();
  }

  transformDate(date: string): string {
    return (new Date(date)).toLocaleString();
  }

  checkInput(input: string) {
    this.inValidIMEI = isNaN(Number(input));
    this.errorMessage = this.inValidIMEI ? 'Wrong IMEI input value' : '';
  }
}
