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

  constructor(
    public dialogRef: MatDialogRef<RegionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {
    this.getCountries();
  }

  save() {
    if (this.data.region.id === undefined) {
      this.data.region.id = uuidv4();
      this.createRegion(this.data.region);
    } else {
      this.updateRegion(this.data.region);
    }
  }

  createRegion(region: Region) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.regions.create;
    this._data
      .post(ENVIRONMENT.baseUrl + endpoint, region)
      .subscribe((res: any) => {
        this.successMessage = 'Region added successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.dialogRef.close('saved');
        }, 1500);
      });
  }

  updateRegion(region: Region) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.regions.update}/${region.id}`;
    this._data
      .put(ENVIRONMENT.baseUrl + endpoint, region)
      .subscribe((res: any) => {
        this.successMessage = 'Region updated successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.dialogRef.close('saved');
        }, 1500);
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  getCountries() {
    const endpoint: string = ENVIRONMENT.endpoints.countries.getAll;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.countries = res;
      },
      (error: any) => {
        this.getCountries();
      }
    );
  }
}
