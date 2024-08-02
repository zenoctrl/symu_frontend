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
  id?: string;
  name?: string;
  region?: string;
  country?: string;
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
    const endpoint: string = ENVIRONMENT.endpoints.branches.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        setTimeout(() => {
          this.isFetching = false;
          this.dataSource = res;
        }, 500);
      },
      (error: any) => {}
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
    const endpoint: string = `${ENVIRONMENT.endpoints.branches.delete}/${branch.id}`;
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
    const endpoint: string = ENVIRONMENT.endpoints.regions.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
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
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.countries = res;
      },
      (error: any) => {
        this.getCountries();
      }
    );
  }
}
