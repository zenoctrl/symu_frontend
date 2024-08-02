import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { v4 as uuidv4 } from 'uuid';
import { Branch } from '../branches.component';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { Country } from '../../countries/countries.component';
import { Region } from '../../regions/regions.component';

@Component({
  selector: 'app-branch-modal',
  templateUrl: './branch-modal.component.html',
  styleUrls: ['./branch-modal.component.scss'],
})
export class BranchModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  statuses: string[] = ['ACTIVE', 'INACTIVE'];
  regions!: Region[];
  countries!: Country[];

  constructor(
    public dialogRef: MatDialogRef<BranchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {
    this.getCountries();
    this.getRegions();
  }

  save() {
    if (this.data.branch.id === undefined) {
      this.data.branch.id = uuidv4();
      this.createBranch(this.data.branch);
    } else {
      this.updateBranch(this.data.branch);
    }
  }

  createBranch(branch: Branch) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.branches.create;
    this._data
      .post(ENVIRONMENT.baseUrl + endpoint, branch)
      .subscribe((res: any) => {
        this.successMessage = 'Branch added successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.dialogRef.close('saved');
        }, 1500);
      });
  }

  updateBranch(branch: Branch) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.branches.update}/${branch.id}`;
    this._data
      .put(ENVIRONMENT.baseUrl + endpoint, branch)
      .subscribe((res: any) => {
        this.successMessage = 'Branch updated successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.dialogRef.close('saved');
        }, 1500);
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  filterRegions() {
    this.regions = this.regions.filter(
      (region: Region) => region.country === this.data.branch.country
    );
  }

  getRegions() {
    const endpoint: string = ENVIRONMENT.endpoints.regions.getAll;
    this._data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.regions = res;
      },
      (error: any) => {
        this.getRegions();
      }
    );
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
