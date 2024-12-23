import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { Role } from '../role-list/role-list.component';


@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss'],
})
export class RoleModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  role!: Role;
  user: any;
  statuses: string[] = ['ACTIVE', 'INACTIVE'];

  constructor(
    public dialogRef: MatDialogRef<RoleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  onClose() {
    this.dialogRef.close();
  }

  save() {
    this.errorMessage = this.successMessage = '';
    if (this.data.role.code === undefined) {
      this.createRole(this.data.role);
    } else {
      this.updateRole(this.data.role);
    }
  }

  createRole(role: any) {
    const payload = {
      roleName: role.roleName,
      roleShortDesc: role.roleName,
      roleDescription: role.roleName,
      roleStatus: "ACTIVE",
      roleCreatedBy: this.user.code,
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.users.roles.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Role saved successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        this.loading = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  updateRole(role: any) {
    const payload = {
      code: role.code,
      roleName: role.roleName,
      roleShortDesc: role.roleName,
      roleDescription: role.roleName,
      roleStatus: role.roleStatus,
      roleCreatedBy: role.roleCreatedBy,
      roleUpdatedBy: this.user.code,
    };
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.users.roles.update;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, payload).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.statusCode == 0) {
          this.successMessage = 'Role saved successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        this.loading = false;
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  }
}
