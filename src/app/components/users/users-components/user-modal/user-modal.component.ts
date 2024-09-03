import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { v4 as uuidv4} from 'uuid';
import { User } from '../user-list/user-list.component';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';
import { Region } from 'src/app/components/setups/setups-components/regions/regions.component';
import { Branch } from 'src/app/components/setups/setups-components/branches/branches.component';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  roles!: any[];
  countries!: Country[];
  regions!: Region[];
  branches!: Branch[];
  _regions!: Region[];
  _branches!: Branch[];
  user: any;

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {
    this.getUser();
    this.getRoles();
    this.getLocations();
  }

  save() {
    if (this.data.user.code === undefined) {
      this.createUser(this.data.user);
    } else {
      this.updateUser(this.data.user);
    }
  }

  createUser(user: any) {
    const payload = {
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      userEmail: user.userEmail,
      userPhone: user.userPhone,
      userId: user.userId,
      userPassword: user.userPassword,
      userRoleCode: user.userRoleCode,
      userCompanyCode: this.user.userCompanyCode,
      userBrnCode: user.userBrnCode,
      userRegionCode: user.userRegionCode,
      userCountryCode: user.userCountryCode,
      userStatus: "ACTIVE"
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.users.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'User saved successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
          this.errorMessage = res.message;
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

  updateUser(user: any) {
     const payload = {
       code: user.code,
       userFirstName: user.userFirstName,
       userLastName: user.userLastName,
       userEmail: user.userEmail,
       userPhone: user.userPhone,
       userId: user.userId,
       userPassword: user.userPassword,
       userRoleCode: user.userRoleCode,
       userCompanyCode: this.user.userCompanyCode,
       userBrnCode: user.userBrnCode,
       userRegionCode: user.userRegionCode,
       userCountryCode: user.userCountryCode,
       userStatus: 'ACTIVE',
     };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.users.update;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'User saved successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
          this.errorMessage = res.message;
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

  onClose() {
    this.dialogRef.close();
  }

  getRoles() {
    this.roles = JSON.parse(sessionStorage.getItem('roles') || '{}');
  }

  getLocations() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '{}');
    this.regions = JSON.parse(sessionStorage.getItem('regions') || '{}');
    this.branches = JSON.parse(sessionStorage.getItem('branches') || '{}');
  }

  selectCountry() {
    this.filterRegions();
    this.data.user.userRegionCode = this.data.user.userBrnCode = null;
    const country = this.countries.find(
      (country: Country) => country.code == this.data.user.userCountryCode
    );
    this.data.user.userPhone = `+${country?.countryCountryCode}`;
  }

  filterRegions() {
    this._regions = this.regions.filter(
      (region: Region) =>
        region.regionCountryCode === this.data.user.userCountryCode
    );
  }

  filterBranches() {
    this._branches = this.branches.filter(
      (branch: Branch) => branch.regionCode === this.data.user.userRegionCode
    );
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }
}
