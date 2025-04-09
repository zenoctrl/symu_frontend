import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { RegionModalComponent } from './region-modal/region-modal.component';
import { Country } from '../countries/countries.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Region {
  code?: string;
  regionCompCode?: string;
  regionCountryCode?: string;
  regionShortDesc?: string;
  regionName?: string;
  regionDesc?: string;
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
    'regionName',
    'country',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();
  region!: Region;
  isFetching!: boolean;
  countries: Country[] = [];
  user: any;

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '{}');
    this.getUser();
    this.getRegions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
    const endpoint: string = `${ENVIRONMENT.endpoints.regions.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('regions', JSON.stringify(res.data));
          this.dataSource.data = res.data.filter((r: any) => r.regionCountryCode == this.user.userCountryCode);
        } else {
        }
      },
      (error: any) => {
        this.isFetching = false;
      }
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
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.regions.delete}/${region.code}`;
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

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }
}
