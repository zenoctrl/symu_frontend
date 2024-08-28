import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { Country } from '../countries.component';
import { ENVIRONMENT } from 'src/app/environments/environments';

@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.scss'],
})
export class CountryModalComponent {
  loading!: boolean; user: any;
  successMessage!: string;
  errorMessage!: string;

  constructor(
    public dialogRef: MatDialogRef<CountryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  save() {
    this.data.country.companyCode = this.user.userCompanyCode;
    if (this.data.country.code === undefined) {
      this.createCountry(this.data.country);
    } else {
      this.updateCountry(this.data.country);
    }
  }

  createCountry(country: Country) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.countries.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, country).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Country added successfully.';
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

  updateCountry(country: Country) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.countries.update;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, country).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Country updated successfully.';
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

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }
}
