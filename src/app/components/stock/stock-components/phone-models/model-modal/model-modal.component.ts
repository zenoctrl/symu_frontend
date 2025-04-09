import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DeviceModel } from '../phone-models.component';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';

@Component({
  selector: 'app-model-modal',
  templateUrl: './model-modal.component.html',
  styleUrls: ['./model-modal.component.scss'],
})
export class ModelModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  statuses: string[] = ['AVAILABLE', 'OUT OF STOCK'];
  countries: Country[] = []; user: any;

  constructor(
    public dialogRef: MatDialogRef<ModelModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  ngOnInit() {
    this.getCountries();
    this.getUser();
  }

  save() {
    this.data.deviceModel.modelCompanyCode = this.user.userCompanyCode;
    this.data.deviceModel.modelShortDesc =
      this.data.deviceModel.modelDescription = this.data.deviceModel.modelName;
    
    if (this.data.deviceModel.code === undefined) {
      this.createDeviceModel(this.data.deviceModel);
    } else {
      this.updateDeviceModel(this.data.deviceModel);
    }
  }

  createDeviceModel(deviceModel: DeviceModel) {
    deviceModel.modelStatus = 'AVAILABLE'; // default on creation
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.phoneModels.create;
    this._data
      .post(ENVIRONMENT.baseUrl + endpoint, deviceModel)
      .subscribe(
        (res: any) => {
          
          if (res.statusCode == 0) {
            this.successMessage = 'Model added successfully.';
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

  updateDeviceModel(deviceModel: DeviceModel) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.phoneModels.update}`;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, deviceModel).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.successMessage = 'Model updated successfully.';
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
    //   this.data.deviceModel.modelCountryCode = this.user.countryEntity.code;
    //   this.data.deviceModel.modelCurrencyCode =
    //     this.user.countryEntity.countryCurrencyCode;
    // }
    this.data.deviceModel.modelCountryCode = this.user.userCountryCode;
    this.data.deviceModel.modelCurrencyCode = this.countries.find(c => c.code == this.user.userCountryCode)?.countryCurrencyCode;
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }

  selectCountry() {
    this.data.deviceModel.modelCurrencyCode = this.countries.find(
      (c) => c.code === this.data.deviceModel.modelCountryCode
    )?.countryCurrencyCode;
  }
}
