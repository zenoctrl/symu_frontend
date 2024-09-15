import { Component, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  displayedColumns: string[] = ['id', 'username', 'contacts', 'role', 'action'];
  user: any;
  roles!: any[];
  isFetching!: boolean;

  dataSource = new MatTableDataSource<any>();
  @ViewChild('paginator') paginator!: MatPaginator;
  
  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.getUser();
    this.getUsers();
    this.getRoles();
  }

  addUser() {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: { user: {}, title: 'Add User' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getUsers();
      }
    });
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  getUsers() {
    this.isFetching = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.users.getAll}?companyCode=${this.user.userCompanyCode}`;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('users', JSON.stringify(res.data));
          this.dataSource.data = res.data;
        } else {
        }
      },
      (error: any) => {
        this.isFetching = false;
      }
    );
  }

  editUser(user: any) {
    const dialogRef = this.dialog.open(UserModalComponent, {
      data: { user: user, title: 'Edit User' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getUsers();
      }
    });
  }

  deleteUser(user: any) {
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.users.delete}/${user.code}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('User deleted successfully.', 'Close');
      this.getUsers();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getRoles() {
    const endpoint: string = ENVIRONMENT.endpoints.users.roles.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          sessionStorage.setItem('roles', JSON.stringify(res.data));
          this.roles = res.data;
        } else {
          this.getRoles();
        }
      },
      (error: any) => {
        this.getRoles();
      }
    );
  }
}
