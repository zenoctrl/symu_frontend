import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { DeviceModel } from '../phone-models.component';

@Component({
  selector: 'app-model-modal',
  templateUrl: './model-modal.component.html',
  styleUrls: ['./model-modal.component.scss'],
})
export class ModelModalComponent {
  loading!: boolean;
  successMessage!: string;
  errorMessage!: string;
  statuses: string[] = ['AVAILABLE', 'OUT OF STOCK'];

  constructor(
    public dialogRef: MatDialogRef<ModelModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ) {}

  save() {
    if (this.data.deviceModel.code === undefined) {
      this.createDeviceModel(this.data.deviceModel);
    } else {
      this.updateDeviceModel(this.data.deviceModel);
    }
  }

  createDeviceModel(deviceModel: DeviceModel) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.phoneModels.create;
    this._data
      .post(ENVIRONMENT.baseUrl + endpoint, deviceModel)
      .subscribe(
        (res: any) => {
          
          if (res.statusCode == 0) {
            this.successMessage = 'Model added successfully.';
            setTimeout(() => {
              this.successMessage = '';
              this.dialogRef.close('saved');
            }, 1500);
          } else {
            this.errorMessage = res.message;
          }
          
        },
        (error: any) => {
          if (error.error.message !== undefined) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Internal server error. Please try again.';
          }
        }
      );
  }

  updateDeviceModel(deviceModel: DeviceModel) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.phoneModels.update}`;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, deviceModel).subscribe(
      (res: any) => {
        if (res.statusCode == 0) {
          this.successMessage = 'Model updated successfully.';
          setTimeout(() => {
            this.successMessage = '';
            this.dialogRef.close('saved');
          }, 1500);
        } else {
          this.errorMessage = res.message;
        }
      },
      (error: any) => {
        if (error.error.message !== undefined) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Internal server error. Please try again.';
        }
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }
}
