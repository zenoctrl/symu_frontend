import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { v4 as uuidv4 } from 'uuid';
import { Phone } from '../phone-list.component';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DeviceModel } from '../../phone-models/phone-models.component';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';
import { Region } from 'src/app/components/setups/setups-components/regions/regions.component';
import { Branch } from 'src/app/components/setups/setups-components/branches/branches.component';

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
  _regions!: Region[];
  _branches!: Branch[];
  user: any;
  fetchingReceipt: any;
  receipt: any;

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
    this.getModels();
    
    if (this.data.title === 'Add Phone') {
      this.getLocations();
    }

    
    if (this.data.title === 'Receipt') {
      this.fetchReceipt(this.data.phone);
    }
  }

  save() {
    this.data.phone.stockCompanyCode = this.user.userCompanyCode;
    this.data.phone.stockCreatedBy = this.user.code;
    if (this.data.phone.code === undefined) {
      this.data.phone.stockStatusCode = 1;
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
    const payload = {
      stockCompanyCode: 1,
      stockCountryCode: this.data.phone.stockCountryCode,
      stockRegionCode: this.data.phone.stockRegionCode,
      stockBranchCode: this.data.phone.stockBranchCode,
      stockImei: this.data.phone.stockImei,
      stockModelCode: this.data.phone.stockModelCode,
      stockMemory: this.data.phone.stockMemory,
      stockBaseCurrency: this.data.phone.stockBaseCurrency,
      stockStatusCode: 1, // set to pending price addition
      stockCreatedBy: this.user.code,
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
    const payload = {
      code: this.data.phone.code,
      stockCompanyCode: 1,
      stockCountryCode: this.data.phone.stockCountryCode,
      stockRegionCode: this.data.phone.stockRegionCode,
      stockBranchCode: this.data.phone.stockBranchCode,
      stockImei: this.data.phone.stockImei,
      stockModelCode: this.data.phone.stockModelCode,
      stockMemory: this.data.phone.stockMemory,
      stockBaseCurrency: this.data.phone.stockBaseCurrency,
      stockStatusCode: 1, // set to pending price addition (maintained)
      stockCreatedBy: this.data.phone.stockCreatedBy,
      stockUpdatedBy: this.user.code,
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
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.stock.phone.postSale;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Sale posted successfully.';
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

  completeSale(phone: any) {
    const payload = {
      stockCode: phone.code,
      userCode: this.user.code,
      nextStatusCode: 4, // moved to sold
      agentNationalId: phone.agentNationalId,
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

  onClose() {
    this.dialogRef.close();
  }

  scanSuccessHandler(result: any) {
    this.data.phone.stockImei = result;
    this.scanning = false;
  }

  getModels() {
    this.models = JSON.parse(sessionStorage.getItem('models') || '{}').filter(
      (model: DeviceModel) => model.modelStatus == 'AVAILABLE'
    );
  }

  getLocations() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '{}');
    this.regions = JSON.parse(sessionStorage.getItem('regions') || '{}');
    this.branches = JSON.parse(sessionStorage.getItem('branches') || '{}');
  }

  selectModel() {
    this.data.phone.stockModelCode = this.models.find(
      (model: DeviceModel) => model.modelName === this.data.phone.stockMemory
    )?.code;
  }

  selectCountry() {
    this.data.phone.stockBaseCurrency = this.countries.find(
      (country: Country) => country.code === this.data.phone.stockCountryCode
    )?.countryCurrencyCode;
    this.filterRegions();
    this.data.phone.stockRegionCode = this.data.phone.stockBranchCode = null;
  }

  filterRegions() {
    this._regions = this.regions.filter(
      (region: Region) =>
        region.regionCountryCode === this.data.phone.stockCountryCode
    );
  }

  filterBranches() {
    this._branches = this.branches.filter(
      (branch: Branch) => branch.regionCode === this.data.phone.stockRegionCode
    );
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  transformDate(date: string): string {
    return (new Date(date)).toLocaleString();
  }
}
