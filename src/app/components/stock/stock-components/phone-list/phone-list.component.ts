import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { PhoneModalComponent } from './phone-modal/phone-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { StockStatus } from '../stock-status/stock-status.component';
import { Country } from 'src/app/components/setups/setups-components/countries/countries.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface Phone {
  id?: string;
  imei?: string;
  model?: string;
  memory?: string;
  price?: string;
  currency?: string;
}

@Component({
  selector: 'app-phone-list',
  templateUrl: './phone-list.component.html',
  styleUrls: ['./phone-list.component.scss'],
})
export class PhoneListComponent {
  user: any;
  displayedColumns: string[] = [
    'id',
    'phone',
    'branch',
    'price',
    'status',
    'date',
    'action',
  ];
  dataSource = new MatTableDataSource<any>();
  stockStatuses!: StockStatus[];
  phone!: any;
  isFetching!: boolean;
  dealerships: any[] = [];
  countries: Country[] = [];

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUser();
    this.getPhones();
    this.getAllStockStatus();
    this.getDealerships();
    this.getCountries();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  addPhone() {
    const dialogRef = this.dialog.open(PhoneModalComponent, {
      data: { phone: {}, title: 'Add Phone', user: this.user },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getPhones();
      }
    });
  }

  getPhones() {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          const role = this.user.roleModel.roleName;
          if (role.toLowerCase().includes('director')) {
            this.dataSource.data = res.data.filter((phone: any) =>
              phone.stockStatusEntity.statusName
                .toLowerCase()
                .includes('available')
            );
          } else if (
            role.toLowerCase().includes('admin') ||
            role.toLowerCase() == 'sales manager'
          ) {
            this.dataSource.data = res.data.filter(
              (phone: any) =>
                phone.stockStatusEntity.statusName
                  .toLowerCase()
                  .includes('available') &&
                phone.stockCountryCode == this.user.userCountryCode
            );
          } else if (role.toLowerCase().includes('region')) {
            this.dataSource.data = res.data.filter(
              (phone: any) =>
                phone.stockStatusEntity.statusName
                  .toLowerCase()
                  .includes('available') &&
                phone.stockRegionCode == this.user.userRegionCode
            );
          } else {
            this.dataSource.data = res.data.filter(
              (phone: any) =>
                phone.stockStatusEntity.statusName
                  .toLowerCase()
                  .includes('available') &&
                phone.stockBranchCode == this.user.userBrnCode
            );
          }
        } else {
        }
      },
      (error: any) => {}
    );
  }

  editPhone(phone: any, title: string) {
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
        this.getPhones();
      }
    });
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

  deletePhone(phone: any) {
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.delete}/${phone.id}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('Phone deleted successfully.', 'Close');
      this.getPhones();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getAllStockStatus() {
    this.stockStatuses = JSON.parse(
      sessionStorage.getItem('stock-status') || '{}'
    );
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

  getCountries() {
    this.countries = JSON.parse(sessionStorage.getItem('countries') || '[]');
  }

  transformDate(date: string) {
    return new Date(date).toLocaleString();
  }

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }

  getBranch(id: number): string {
    return JSON.parse(sessionStorage.getItem('branches') || '[]').find(
      (b: any) => b.code == id
    ).name;
  }

  getCountry(id: number): string {
    return JSON.parse(sessionStorage.getItem('countries') || '[]').find(
      (b: any) => b.code == id
    ).countryName;
  }
}
