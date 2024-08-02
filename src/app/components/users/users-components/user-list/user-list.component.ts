import { Component } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';

export interface User {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  country?: string;
  branch?: string;
  password?: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  displayedColumns: string[] = ['id', 'username', 'phoneNumber', 'shop', 'role', 'action'];
  dataSource!: User[]; user!: User;
  isFetching!: boolean;

  constructor( public dialog: MatDialog, private data: DataService, public snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  addUser() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: {user: {}, title: 'Add User'},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getUsers();
      }
    });
  }

  getUsers() {
    this.isFetching = true;
    const endpoint: string = ENVIRONMENT.endpoints.users.getAll;
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

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: {user: user, title: 'Edit User'},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getUsers();
      }
    });
  }

  deleteUser(user: User) {
    const endpoint: string = `${ENVIRONMENT.endpoints.users.delete}/${user.id}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.openSnackBar("User deleted successfully.", "Close");
        this.getUsers();
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
