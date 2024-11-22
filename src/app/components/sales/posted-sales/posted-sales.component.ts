import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
    'branch',
    'action',
  ];
  dataSource = new MatTableDataSource<any[]>();
  phone!: any;
  isFetching!: boolean;
  dealerships: any[] = [];
  stockStatuses!: StockStatus[];
  countries: Country[] = [];
  page: number = 0; size: number = 2000;
  RETRY_COUNT: number = 3;

  @ViewChild('paginator') paginator!: MatPaginator;
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getPhones() {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.getAll}?companyCode=${this.user.userCompanyCode}&statusShortDesc=POSTED&page=${this.page}&size=${this.size}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        this.dataSource.paginator = this.paginator;
        if (res.statusCode == 0) {
          const role = this.user.roleModel.roleName;
          if (role.toLowerCase().includes('director')) {
            this.dataSource.data = this.dataSource.data.concat(res.data.content);
          } else if (
            role.toLowerCase().includes('admin') ||
            role.toLowerCase() == 'sales manager'
          ) {
            this.dataSource.data = this.dataSource.data.concat(res.data.content.filter(
              (phone: any) =>
                phone.stockCountryCode == this.user.userCountryCode
            ));
          } else if (role.toLowerCase().includes('region')) {
            this.dataSource.data = this.dataSource.data.concat(res.data.content.filter(
              (phone: any) =>
                phone.stockRegionCode == this.user.userRegionCode
            ));
          } else {
            this.dataSource.data = this.dataSource.data.concat(res.data.content.filter(
              (phone: any) =>
                phone.stockBranchCode == this.user.userBrnCode
            ));
          }
          
          // fetch some more if page is not last
          if (!res.data.last) {
            this.page++;
            this.getPhones();
          } 
        } else {
          if (this.RETRY_COUNT > 0) {
            setTimeout(() => {
              this.getPhones();
              this.RETRY_COUNT--;
            }, 3000);
          } else {
            this.openSnackBar('Failed to fetch resources. Please refresh page.', 'Close');
          }
        }
      },
      (error: any) => {
        if (this.RETRY_COUNT > 0) {
          setTimeout(() => {
            this.getPhones();
            this.RETRY_COUNT--;
          }, 3000);
        } else {
          this.openSnackBar('Failed to fetch resources. Please refresh page.', 'Close');
        }
      }
    );
  }

  refresh() {
    this.dataSource.data = [];
    this.getPhones();
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
        this.dataSource.data = [];
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
    const role = this.user.roleModel.roleName;
    if (
      !role.toLowerCase().includes('director') ||
      !role.toLowerCase().includes('admin')
    ) {
      this.displayedColumns = this.displayedColumns.filter(
        (column: string) => !column.includes('price')
      );
    }
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

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }
}
