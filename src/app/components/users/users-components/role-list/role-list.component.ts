import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RoleModalComponent } from '../role-modal/role-modal.component';

export interface Role {
  code: number;
  roleName: string;
  roleShortDesc: string;
  roleDescription: string;
  roleStatus?: string;
  roleCreatedBy?: string;
  roleUpdatedBy?: string;
  rolePermissionModelSet?: any[];
}

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent {
  displayedColumns: string[] = ['id', 'name', 'action'];
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
    this.getRoles();
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }

  getRoles() {
    const endpoint: string = ENVIRONMENT.endpoints.users.roles.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.dataSource.data = res.data.filter((role: Role) => role.roleStatus?.toUpperCase() != 'DELETED');
          sessionStorage.setItem('roles', JSON.stringify(this.dataSource.data));
        } else {
          setTimeout(() => {
            this.getRoles();
          }, 3000);
        }
      },
      (error: any) => {
        setTimeout(() => {
          this.getRoles();
        }, 3000);
      }
    );
  }

  addRole() {
    const dialogRef = this.dialog.open(RoleModalComponent, {
      data: { role: {}, title: 'Add Role' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getRoles();
      }
    });
  }

  editRole(role: Role) {
    const dialogRef = this.dialog.open(RoleModalComponent, {
      data: { role: role, title: 'Edit Role' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getRoles();
      }
    });
  }

  deleteRole(role: Role) {
    const payload = {
      code: role.code,
      roleName: role.roleName,
      roleShortDesc: role.roleName,
      roleDescription: role.roleName,
      roleStatus: "DELETED",
      roleCreatedBy: role.roleCreatedBy,
      roleUpdatedBy: this.user.code,
    };
    this.isFetching = true;
    const endpoint: string = ENVIRONMENT.endpoints.users.roles.update;
    this.data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          this.openSnackBar('Role deleted successfully.', 'Close');
          this.getRoles();
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
