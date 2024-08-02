import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { v4 as uuidv4} from 'uuid';
import { User } from '../user-list/user-list.component';
import { ENVIRONMENT } from 'src/app/environments/environments';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {

  roles: string[] = ['SUPER ADMIN', 'ADMIN', 'SHOP MANAGER', 'FIELD MANAGER', 'SALES REPRESENTATIVE'];
  countries: string[] = ['KENYA', 'UGANDA', 'TANZANIA'];
  loading!: boolean; successMessage!: string; errorMessage!: string;

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ){}

  save() {
    if (this.data.user.id === undefined) {
      this.data.user.id = uuidv4();
      this.createUser(this.data.user);
    } else {
      this.updateUser(this.data.user);
    }
  }

  createUser(user: User) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.users.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, user).subscribe(
      (res: any) => {
        this.successMessage = "User saved successfully.";
        setTimeout(() => {
          this.successMessage = "";
          this.dialogRef.close("saved");
        }, 1500);
      }
    );
    
  }

  updateUser(user: User) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.users.update}/${user.id}`;
    this._data.put(ENVIRONMENT.baseUrl + endpoint, user).subscribe(
      (res: any) => {
        this.successMessage = "User saved successfully.";
        setTimeout(() => {
          this.successMessage = "";
          this.dialogRef.close("saved");
        }, 1500);
      }
    );
  }


  onClose() {
    this.dialogRef.close();
  }

}
