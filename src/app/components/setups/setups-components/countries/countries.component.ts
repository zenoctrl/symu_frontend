import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { CountryModalComponent } from './country-modal/country-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Country {
  code?: string;
  countryName?: string;
  countryCountryCode?: string;
  countryShortDesc?: string;
  countryCurrencyCode?: string;
  status?: string;
}

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent {
  displayedColumns: string[] = [
    'id',
    'countryName',
    'countryCurrencyCode',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();
  user!: any;
  isFetching!: boolean;

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getUser();
    this.getCountries();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addCountry() {
    const dialogRef = this.dialog.open(CountryModalComponent, {
      data: { country: {}, title: 'Add Country' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getCountries();
      }
    });
  }

  getCountries() {
    this.isFetching = true;
    const endpoint: string = ENVIRONMENT.endpoints.countries.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('countries', JSON.stringify(res.data));
          this.dataSource.data = res.data;
        } else {
        }
      },
      (error: any) => {
        this.isFetching = false;
      }
    );
  }

  editCountry(country: Country) {
    const dialogRef = this.dialog.open(CountryModalComponent, {
      data: { country: country, title: 'Edit Country' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getCountries();
      }
    });
  }

  deleteCountry(country: Country) {
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.countries.delete}/${country.code}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('Country deleted successfully.', 'Close');
      this.getCountries();
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
