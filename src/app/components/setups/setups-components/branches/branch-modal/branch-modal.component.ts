import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
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
  user: any;

  constructor(
    public dialogRef: MatDialogRef<BranchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}
    

  ngOnInit() {
    this.getUser();
    this.getCountries();
    // this.getRegions();
  }

  save() {
    this.data.branch.companyCode = this.user.userCompanyCode;
    if (this.data.branch.code === undefined) {
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
      .subscribe(
        (res: any) => {
          this.loading = false;
          if (res.statusCode == 0) {
            this.successMessage = 'Branch added successfully.';
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

  updateBranch(branch: Branch) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.branches.update;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, branch).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Branch updated successfully.';
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

  filterRegions() {
    this.regions = this.regions.filter(
      (region: Region) =>
        region.regionCountryCode === this.data.branch.countryCode
    );
  }

  getRegions() {
    this.regions = JSON.parse(sessionStorage.getItem('regions') || '{}');
    this.filterRegions();
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '{}');
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.data.branch.countryCode = this.user.userCountryCode;
    this.getRegions();
  }

}
