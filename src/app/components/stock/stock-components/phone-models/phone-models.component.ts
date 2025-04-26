import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/services/data.service';
import { ENVIRONMENT } from 'src/app/environments/environments';
import { ModelModalComponent } from './model-modal/model-modal.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface DeviceModel {
  code?: string;
  modelName?: string;
  modelShortDesc?: string;
  modelDescription?: string;
  modelStatus?: string;
  modelCompanyCode?: string;
  modelCountryCode?: string;
  modelCurrencyCode?: string;
  modelSellingPrice?: string;
  countryEntity?: any;
}

@Component({
  selector: 'app-phone-models',
  templateUrl: './phone-models.component.html',
  styleUrls: ['./phone-models.component.scss'],
})
export class PhoneModelsComponent {
  displayedColumns: string[] = ['id', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource<DeviceModel[]>();
  isFetching!: boolean;
  user: any;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private data: DataService,
    public snackBar: MatSnackBar
  ) {
    this.getUser();
    this.getDeviceModels();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
          const role = this.user.roleModel.roleName;
          const models = res.data.sort((a: any, b: any) => {
            if (a.modelName.toLowerCase() < b.modelName.toLowerCase()) return -1;
            if (a.modelName.toLowerCase() > b.modelName.toLowerCase()) return 1;
            return 0;
          });
          // if (role.toLowerCase().includes('director')) {
          //   this.dataSource.data = models;
          // } else {
          //   this.dataSource.data = models.filter(
          //     (model: any) =>
          //       model.modelCountryCode == this.user.userCountryCode
          //   );
          // }
          this.dataSource.data = models.filter(
            (model: any) =>
              model.modelCountryCode == this.user.userCountryCode
          );
          this.dataSource.paginator = this.paginator;
        } else {
        }
      },
      (error: any) => {
        this.isFetching = false;
      }
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

  getUser() {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = this.user.roleModel.roleName;
    if (
      !role.toLowerCase().includes('director') &&
      !role.toLowerCase().includes('admin')
    ) {
      this.displayedColumns = this.displayedColumns.filter(
        (column: string) =>
          !column.includes('price') && !column.includes('action')
      );
    }
  }

  search(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.dataSource.filter = text.trim().toLowerCase();
  }
}
