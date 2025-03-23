import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DataService } from 'src/app/services/data.service';
import { InventoryModalComponent } from './inventory-modal/inventory-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-capture-inventory',
  templateUrl: './capture-inventory.component.html',
  styleUrls: ['./capture-inventory.component.scss']
})
export class CaptureInventoryComponent {

  user: any;
  errorMessage!: string;
  dataSource = new MatTableDataSource<any[]>();
  displayedColumns: string[] = [];
  loading!: boolean;
  page: number = 0; size: number = 2000;
  RETRY_COUNT: number = 3;
  rowData = [];
  checkAll: boolean = false;
  checkedStockCodes: string[] = [];
  canAddStock!: boolean;
  canUpdateStockStatus!: boolean;
  showAddBtn!: boolean;
  showApproveBtn!: boolean;
  showDeleteBtn!: boolean;
  stockStatuses: any[] = [];

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUser();
    this.getPhones();
    this.getDimensions();
    this.getStockStatuses();
  }


  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role: string = this.user.roleModel.roleName.toLowerCase();

    // add stock permission
    if (role === 'director' || role.includes('admin')) {
      this.canAddStock = true;
      this.canUpdateStockStatus = true;
      this.showAddBtn = this.showApproveBtn = this.showDeleteBtn = true;
    }

    // approve stock permission
    if (
      role.includes('field sales manager') ||
      role.includes('sales executive') ||
      role.includes('shop')
    ) {
      this.canUpdateStockStatus = true;
      this.showApproveBtn = true;
    }
  }

  addPhone() {

    if (!this.canAddStock) {
      this.openSnackBar('Permission denied.', 'Close');
      return;
    }

    const dialogRef = this.dialog.open(InventoryModalComponent, {
      data: { stock: {}, title: 'Add Stock', user: this.user },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.page = 0;
        this.dataSource.data = [];
        this.getPhones();
      }
    });
  }

  getPhones() {
    this.loading = true;
    let countryCode = this.user.roleModel.roleName.toLowerCase().includes('director') ? null : this.user.userCountryCode;
    const endpoint: string = `${ENVIRONMENT.endpoints.stock.phone.getAll}?companyCode=${this.user.userCompanyCode}&stockCountryCode=${countryCode}&stockRegionCode=${this.user.userRegionCode}&stockBranchCode=${this.user.userBrnCode}&stockClusterCode=${this.user.userClusterCode}&statusShortDesc=PRICES&page=${this.page}&size=${this.size}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {

          this.dataSource.paginator = this.paginator;
          this.dataSource.data = this.dataSource.data.concat(res.data.content);

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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000,
    });
  }

  getDimensions(){
    if(window.innerWidth > window.innerHeight){
      this.displayedColumns = ['#', 'imei', 'model', 'batch', 'branch', 'cluster', 'country'];
    }
    else if(window.innerWidth < window.innerHeight){
      this.displayedColumns = ['#', 'imei', 'branch'];
    }
  }

  checkAllStock() {
    this.checkAll = !this.checkAll;
    const checkBoxes = Array.from(document.querySelectorAll('.check-imei') as unknown as HTMLCollectionOf<HTMLInputElement>);
    if (this.checkAll) {
      checkBoxes.forEach(checkbox => {
        checkbox.checked = true;
        this.checkedStockCodes.push(checkbox.getAttribute('name') || '');
      })
    } else {
      checkBoxes.forEach(checkbox => { checkbox.checked = false;});
      this.checkedStockCodes = [];
    }
    
  }

  checkAStock(event: Event) {
    this.checkAll = false;
    const stockCode: string = (event.target as HTMLInputElement).getAttribute('name') || '';
    if (this.checkedStockCodes.includes(stockCode)) {
      this.checkedStockCodes = this.checkedStockCodes.filter(code => code != stockCode);
    } else {
      this.checkedStockCodes.push(stockCode);
    }
  }

  updateStockStatus(status: string) {

    if (this.checkedStockCodes.length == 0 || this.loading) return;

    if (!this.canUpdateStockStatus) {
      this.openSnackBar('Permission denied.', 'Close');
      return;
    }

    const numberOfPhones = this.checkedStockCodes.length;
    let message;
    let statusCode;

    if (this.stockStatuses.length > 0) {
      statusCode = this.stockStatuses.find(s => s.statusShortDesc.toLowerCase() == status).statusCode;
    } else {
      this.openSnackBar('Missing stock statuses.', 'Close');
      return;
    }

    if (status == 'available') {
      message = `Confirm approval of ${
        numberOfPhones + (numberOfPhones == 1 ? ' phone' : ' phones')
      } to the stock.`;
    }
    
    if (status == 'deleted') {
      message = `Confirm deleting ${
        numberOfPhones + (numberOfPhones == 1 ? ' phone' : ' phones')
      } from the stock.`;
    }

    if (window.confirm(message)) {
      const payload = {
        userCode: this.user.code,
        nextStatusCode: statusCode,
        stockCode: this.checkedStockCodes
      }
      this.loading = true;
      const endpoint: string = ENVIRONMENT.endpoints.stock.bulk.approve;
      this.data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
        (res: any) => {
          this.loading = false;
          if (res.statusCode == 0) {
            this.page = 0;
            this.dataSource.data = [];
            this.getPhones();
          } 
        },
        (error: any) => {
          this.loading = false;
          if (error.error.message !== undefined) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Internal server error. Please try again.';
          }
          this.openSnackBar(this.errorMessage, 'Close');
        }
      )
    }

  }

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }

  getStockStatuses() {
    const endpoint: string = ENVIRONMENT.endpoints.stock.status.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.stockStatuses = res.data;
        }
      },
      (error: any) => {
        setTimeout(() => {
          this.getStockStatuses();
        }, 3000);
      }
    );
  }


}
