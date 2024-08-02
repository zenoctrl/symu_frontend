import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { RegionModalComponent } from './region-modal/region-modal.component';

export interface Region {
  id?: string;
  name?: string;
  country?: string;
  status?: string;
}

@Component({
  selector: 'app-regions',
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.scss'],
})
export class RegionsComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'country',
    'status',
    'action',
  ];
  dataSource!: Region[];
  region!: Region;
  isFetching!: boolean;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getRegions();
  }

  addRegion() {
    const dialogRef = this.dialog.open(RegionModalComponent, {
      data: { region: {}, title: 'Add Region' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getRegions();
      }
    });
  }

  getRegions() {
    this.isFetching = true;
    const endpoint: string = ENVIRONMENT.endpoints.regions.getAll;
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

  editRegion(region: Region) {
    const dialogRef = this.dialog.open(RegionModalComponent, {
      data: { region: region, title: 'Edit Region' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getRegions();
      }
    });
  }

  deleteRegion(region: Region) {
    const endpoint: string = `${ENVIRONMENT.endpoints.regions.delete}/${region.id}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('Region deleted successfully.', 'Close');
      this.getRegions();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
