import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data.service';
import { v4 as uuidv4} from 'uuid';
import { Phone } from '../phone-list/phone-list.component';
import { ENVIRONMENT } from 'src/app/environments/environments';

@Component({
  selector: 'app-phone-modal',
  templateUrl: './phone-modal.component.html',
  styleUrls: ['./phone-modal.component.scss']
})
export class PhoneModalComponent {

  currencies: {name: string, code: string}[] = [
    {
      name: "Ugandan Shilling",
      code: "UGX"
    },
    {
      name: "Kenyan Shilling",
      code: "KES"
    }
  ];
  loading!: boolean; successMessage!: string; errorMessage!: string;
  scanning!: boolean;

  constructor(
    public dialogRef: MatDialogRef<PhoneModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _data: DataService
  ){}

  ngOnInit() {
    // if (this.data.phone.imei === undefined) {
    //   this.scanning = true;
    // } else {
    //   this.scanning = false;
    // }
  }

  save() {
    if (this.data.phone.id === undefined) {
      this.data.phone.id = uuidv4();
      this.createPhone(this.data.phone);
    } else {
      this.updatePhone(this.data.phone);
    }
  }

  createPhone(phone: Phone) {
    this.loading = true;
    const endpoint: string = ENVIRONMENT.endpoints.phones.create;
    this._data.post(ENVIRONMENT.baseUrl + endpoint, phone).subscribe(
      (res: any) => {
        this.successMessage = "Phone saved successfully.";
        setTimeout(() => {
          this.successMessage = "";
          this.dialogRef.close("saved");
        }, 1500);
      }
    );
    
  }

  updatePhone(phone: Phone) {
    this.loading = true;
    const endpoint: string = `${ENVIRONMENT.endpoints.phones.update}/${phone.id}`;
    this._data.put(ENVIRONMENT.baseUrl + endpoint, phone).subscribe(
      (res: any) => {
        this.successMessage = "Phone saved successfully.";
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

  scanSuccessHandler(result: any) {
    this.data.phone.imei = result;
    this.scanning = false;
  }

}
