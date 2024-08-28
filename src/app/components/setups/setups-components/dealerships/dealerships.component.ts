import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { Country } from '../countries/countries.component';
import { DealershipModalComponent } from './dealership-modal/dealership-modal.component';

export interface Dealership {
  dealerCode?: string;
  dealerCompanyCode?: string;
  dealerCountryCode?: string;
  dealerName?: string;
  dealerShortDec?: string;
  dealerStatus?: string;
}

@Component({
  selector: 'app-dealerships',
  templateUrl: './dealerships.component.html',
  styleUrls: ['./dealerships.component.scss'],
})
export class DealershipsComponent {
  user!: any;
  isFetching!: boolean;
  countries: Country[] = [];
  dataSource!: Dealership[];

  displayedColumns: string[] = [
    'id',
    'name',
    'country',
    'status',
    'action',
  ];

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getUser();
    this.getCountries();
    this.getDealerships();
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }

  addDealership() {
    const dialogRef = this.dialog.open(DealershipModalComponent, {
      data: { dealership: {}, title: 'Add Dealership' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getDealerships();
      }
    });
  }

  editDealership(dealership: Dealership) {
    const dialogRef = this.dialog.open(DealershipModalComponent, {
      data: { dealership: dealership, title: 'Edit Dealership' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getDealerships();
      }
    });
  }

  getDealerships() {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.dealership.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('dealerships', JSON.stringify(res.data));
          this.dataSource = res.data;
        } else {
          this.getDealerships();
        }
      },
      (error: any) => {
        this.isFetching = false;
        this.getDealerships();
      }
    );
  }
}
