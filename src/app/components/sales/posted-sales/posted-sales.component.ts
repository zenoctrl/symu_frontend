import { Component, Output, EventEmitter } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { PhoneModalComponent } from '../../stock/stock-components/phone-list/phone-modal/phone-modal.component';
import { StockStatus } from '../../stock/stock-components/stock-status/stock-status.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';

@Component({
  selector: 'app-posted-sales',
  templateUrl: './posted-sales.component.html',
  styleUrls: ['./posted-sales.component.scss'],
})
export class PostedSalesComponent {
  user: any;
  displayedColumns: string[] = [
    'id',
    'imei',
    'model',
    'price',
    'status',
    'action',
  ];
  dataSource!: any[];
  phone!: any;
  isFetching!: boolean;
  dealerships: any[] = [];
  stockStatuses!: StockStatus[];
  countries: Country[] = [];

  @Output() completeEvent = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getUser();
    this.getPhones();
    this.getAllStockStatus();
    this.getDealerships();
    this.getCountries();
  }

  getPhones() {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          this.dataSource = res.data.filter((phone: any) =>
            phone.stockStatusEntity.statusName.toLowerCase().includes('posted')
          );
        } else {
          this.getPhones();
        }
      },
      (error: any) => {
        this.getPhones();
      }
    );
  }

  getAllStockStatus() {
    this.stockStatuses = JSON.parse(
      sessionStorage.getItem('stock-status') || '{}'
    );
  }

  editPhone(phone: any, title: string) {

    const country = this.countries.find(
      (country: Country) => country.code == phone.stockCountryCode
    );

    if (title.toLowerCase().includes('complete'))
      phone.agentPhoneNumber = `+${country?.countryCountryCode}`;

    const dialogRef = this.dialog.open(PhoneModalComponent, {
      data: {
        phone: phone,
        title: title,
        user: this.user,
        dealers: this.dealerships.filter(
          (d) => d.dealerCountryCode === phone.stockCountryCode
        ),
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.completeEvent.emit();
        this.getPhones();
      }
    });
  }

  reject(phone: any) {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.rejectSale}?stockCode=${phone.code}&userCode=${this.user.code}`;
    alert('Are you sure to want to reject this sale?');
    this.data.post(ENVIRONMENT.baseUrl + endpoint, {}).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          this.getPhones();
        } else {
          this.isFetching = false;
          this.openSnackBar(res.message, 'Close');
        }
      },
      (error: any) => {
        this.isFetching = false;
        this.openSnackBar('Request failed.', 'Close');
      }
    );
  }

  viewReceipt(phone: any) {
    const dialogRef = this.dialog.open(PhoneModalComponent, {
      data: {
        phone: phone,
        title: 'Receipt',
        user: this.user,
      },
      disableClose: true,
    });
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  getDealerships() {
    const endpoint: string = `${ENVIRONMENT.endpoints.dealership.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.dealerships = res.data;
        } else {
          this.getDealerships();
        }
      },
      (error: any) => {
        this.getDealerships();
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }
}
