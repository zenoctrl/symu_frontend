import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { BranchModalComponent } from './branch-modal/branch-modal.component';
import { Region } from '../regions/regions.component';
import { Country } from '../countries/countries.component';

export interface Branch {
  code?: string;
  name?: string;
  shortDesc?: string;
  desc?: string;
  regionCode?: string;
  countryCode?: string;
  companyCode?: string;
  status?: string;
}

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
})
export class BranchesComponent {
  displayedColumns: string[] = ['id', 'name', 'region', 'status', 'action'];
  dataSource!: Branch[];
  branch!: Branch;
  isFetching!: boolean;
  regions!: Region[]; countries!: Country[];

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getBranches();
    this.getRegions();
    this.getCountries();
  }

  addBranch() {
    const dialogRef = this.dialog.open(BranchModalComponent, {
      data: { branch: {}, title: 'Add Branch', countries: this.countries, regions: this.regions },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getBranches();
      }
    });
  }

  getBranches() {
    this.isFetching = true;
    const endpoint: string =
      ENVIRONMENT.endpoints.branches.getAll + '?companyCode=1';
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('branches', JSON.stringify(res.data));
          this.dataSource = res.data;
        } else {
        }
      },
      (error: any) => {
        this.isFetching = false;
      }
    );
  }

  editBranch(branch: Branch) {
    const dialogRef = this.dialog.open(BranchModalComponent, {
      data: { branch: branch, title: 'Edit Branch', countries: this.countries, regions: this.regions },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getBranches();
      }
    });
  }

  deleteBranch(branch: Branch) {
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.branches.delete}/${branch.code}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('Branch deleted successfully.', 'Close');
      this.getBranches();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getRegions() {
    this.regions = JSON.parse(sessionStorage.getItem('regions') || '{}');
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '{}');
  }
}
