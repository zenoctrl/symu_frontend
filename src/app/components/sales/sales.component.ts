import { Component, ViewChild } from '@angular/core';
import { AfterSalesComponent } from './after-sales/after-sales.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent {
  @ViewChild(AfterSalesComponent) afterSaleComponent!: AfterSalesComponent;

  handleCompleteEvent() {
    console.log('sale completed');
    this.afterSaleComponent.getPhones();
  }
}
