import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { v4 as uuidv4 } from 'uuid';
import { Region } from '../regions.component';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { Country } from '../../countries/countries.component';

@Component({
  selector: 'app-region-modal',
  templateUrl: './region-modal.component.html',
  styleUrls: ['./region-modal.component.scss'],
})
export class RegionModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  countries: Country[] = [];
  statuses: string[] = ['ACTIVE', 'INACTIVE'];
  user: any;

  constructor(
    public dialogRef: MatDialogRef<RegionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {
    // this.getCountries();
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}')
    this.data.region.regionCountryCode = this.user.userCountryCode;
  }

  save() {
    this.data.region.regionCompanyCode = JSON.parse(
      sessionStorage.getItem('user') || '{}'
    ).userCompanyCode;
    if (this.data.region.id === undefined) {
      this.createRegion(this.data.region);
    } else {
      this.updateRegion(this.data.region);
    }
  }

  createRegion(region: Region) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.regions.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, region).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Region added successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 500);
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

  updateRegion(region: Region) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.regions.update;
    this._data.put(ENVIRONMENT.baseUrl + endpoint, region).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Region updated successfully.';
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

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '{}');
  }
}
