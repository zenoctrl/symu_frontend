import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { v4 as uuidv4 } from 'uuid';
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
    if (this.data.deviceModel.id === undefined) {
      this.data.deviceModel.id = uuidv4();
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
      .subscribe((res: any) => {
        this.successMessage = 'Model added successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.dialogRef.close('saved');
        }, 1500);
      });
  }

  updateDeviceModel(deviceModel: DeviceModel) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.phoneModels.update}/${deviceModel.id}`;
    this._data
      .put(ENVIRONMENT.baseUrl + endpoint, deviceModel)
      .subscribe((res: any) => {
        this.successMessage = 'Model updated successfully.';
        setTimeout(() => {
          this.successMessage = '';
          this.dialogRef.close('saved');
        }, 1500);
      });
  }

  onClose() {
    this.dialogRef.close();
  }
}
