import { Component } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PhoneModalComponent } from '../phone-modal/phone-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';

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
  styleUrls: ['./phone-list.component.scss']
})
export class PhoneListComponent {
  displayedColumns: string[] = ['id', 'imei', 'model', 'price', 'action'];
  dataSource!: Phone[]; phone!: Phone;
  isFetching!: boolean;

  constructor( public dialog: MatDialog, private data: DataService, public snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.getPhones();
  }

  addPhone() {
    const dialogRef = this.dialog.open(PhoneModalComponent, {
      data: {phone: {}, title: 'Add Phone'},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getPhones();
      }
    });
  }

  getPhones() {
    this.isFetching = true;
    const endpoint: string = ENVIRONMENT.endpoints.phones.getAll;
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

  editPhone(phone: Phone) {
    const dialogRef = this.dialog.open(PhoneModalComponent, {
      data: {phone: phone, title: 'Edit Phone'},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getPhones();
      }
    });
  }

  deletePhone(phone: Phone) {
    const endpoint: string = `${ENVIRONMENT.endpoints.phones.delete}/${phone.id}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.openSnackBar("Phone deleted successfully.", "Close");
        this.getPhones();
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
