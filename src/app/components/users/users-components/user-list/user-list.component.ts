import { Component, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Role } from '../role-list/role-list.component';
import { Cluster } from 'cluster';

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
          this.dataSource.data = res.data.filter(
            (user: any) => user.userStatus.toUpperCase() == 'ACTIVE' && user.userCountryCode == this.user.userCountryCode
          );
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

    let message: string = `Are you sure you want to delete ${user.userFirstName}?`;
    if (window.confirm(message)) {
      const payload = {
        code: user.code,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userEmail: user.userEmail,
        userPhone: user.userPhone,
        userId: user.userId,
        userPassword: user.userPassword,
        userRoleCode: user.userRoleCode,
        userCompanyCode: this.user.userCompanyCode,
        userBrnCode: user.userBrnCode,
        userRegionCode: user.userRegionCode,
        userCountryCode: user.userCountryCode,
        userStatus: 'DELETED',
      };
      this.isFetching = true;
      const endpoint: string = ENVIRONMENT.endpoints.users.update;
      this.data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
        (res: any) => {
          this.isFetching = false;
          if (res.statusCode == 0) {
            this.openSnackBar('User deleted successfully.', 'Close');
            this.getUsers();
          } else {
            this.openSnackBar(res.message, 'Close');
          }
        },
        (error: any) => {
          this.isFetching = false;
          let message;
          if (error.error.message !== undefined) {
            message = error.error.message;
          } else {
            message = 'Internal server error. Please try again.';
          }
          this.openSnackBar(message, 'Close');
        }
      );
    }

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
          this.roles = res.data.filter(
            (role: Role) => role.roleStatus?.toUpperCase() != 'DELETED'
          );
          sessionStorage.setItem('roles', JSON.stringify(this.roles));
        } else {
          this.getRoles();
        }
      },
      (error: any) => {
        this.getRoles();
      }
    );
  }

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }
}
