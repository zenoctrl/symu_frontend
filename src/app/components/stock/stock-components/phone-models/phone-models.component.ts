import { Component } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { ModelModalComponent } from './model-modal/model-modal.component';

export interface DeviceModel {
  code?: string;
  modelName?: string;
  modelStatus?: string;
}

@Component({
  selector: 'app-phone-models',
  templateUrl: './phone-models.component.html',
  styleUrls: ['./phone-models.component.scss'],
})
export class PhoneModelsComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'status',
    'action',
  ];
  dataSource!: DeviceModel[];
  isFetching!: boolean;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getDeviceModels();
  }

  addDeviceModel() {
    const dialogRef = this.dialog.open(ModelModalComponent, {
      data: { deviceModel: {}, title: 'Add Device Model' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getDeviceModels();
      }
    });
  }

  getDeviceModels() {
    this.isFetching = true;
    const endpoint: string = ENVIRONMENT.endpoints.phoneModels.getAll;
    this.data.get(ENVIRONMENT.baseUrl + endpoint).subscribe(
      (res: any) => {
        this.isFetching = false;
        if (res.statusCode == 0) {
          sessionStorage.setItem('models', JSON.stringify(res.data));
          this.dataSource = res.data;
        } else {

        }
      },
      (error: any) => { this.isFetching = false; }
    );
  }

  editDeviceModel(deviceModel: DeviceModel) {
    const dialogRef = this.dialog.open(ModelModalComponent, {
      data: { deviceModel: deviceModel, title: 'Edit Device Model' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getDeviceModels();
      }
    });
  }

  deleteDeviceModel(deviceModel: DeviceModel) {
    return;
    const endpoint: string = `${ENVIRONMENT.endpoints.phoneModels.delete}/${deviceModel.code}`;
    this.data.delete(ENVIRONMENT.baseUrl + endpoint).subscribe((res: any) => {
      this.openSnackBar('Model deleted successfully.', 'Close');
      this.getDeviceModels();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
