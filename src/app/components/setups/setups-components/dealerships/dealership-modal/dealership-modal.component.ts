import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { Dealership } from '../dealerships.component';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { Country } from '../../countries/countries.component';

@Component({
  selector: 'app-dealership-modal',
  templateUrl: './dealership-modal.component.html',
  styleUrls: ['./dealership-modal.component.scss'],
})
export class DealershipModalComponent {
  loading!: boolean;
  user: any; countries: Country[] = [];
  successMessage!: string;
  errorMessage!: string;
  statuses: String[] = ['ACTIVE', 'INACTIVE'];

  constructor(
    public dialogRef: MatDialogRef<DealershipModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  ngOnInit() {
    this.getUser();
    this.getCountries();
  }

  save() {
    this.data.dealership.dealerCompanyCode = this.user.userCompanyCode;
    this.data.dealership.dealerShortDec = this.data.dealership.dealerName;
    if (this.data.dealership.dealerCode === undefined) {
      this.createDealership(this.data.dealership);
    } else {
      this.updateDealership(this.data.dealership);
    }
  }

  createDealership(dealership: Dealership) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.dealership.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, dealership).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Dealership added successfully.';
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

  updateDealership(dealership: Dealership) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.dealership.update;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, dealership).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Dealership updated successfully.';
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

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }
}
