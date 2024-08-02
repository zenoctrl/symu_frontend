import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { v4 as uuidv4 } from 'uuid';
import { Country } from '../countries.component';
import { ENVIRONMENT } from 'src/app/environments/environments';

@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrls: ['./country-modal.component.scss'],
})
export class CountryModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;

  constructor(
    public dialogRef: MatDialogRef<CountryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  save() {
    if (this.data.country.id === undefined) {
      this.data.country.id = uuidv4();
      this.createCountry(this.data.country);
    } else {
      this.updateCountry(this.data.country);
    }
  }

  createCountry(country: Country) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.countries.create;
    this._data
      .post(ENVIRONMENT.baseUrl + endpoint, country)
      .subscribe((res: any) => {
        this.successMessage = 'Country added successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.dialogRef.close('saved');
        }, 1500);
      });
  }

  updateCountry(country: Country) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.countries.update}/${country.id}`;
    this._data
      .put(ENVIRONMENT.baseUrl + endpoint, country)
      .subscribe((res: any) => {
        this.successMessage = 'Country updated successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.dialogRef.close('saved');
        }, 1500);
      });
  }

  onClose() {
    this.dialogRef.close();
  }
}
