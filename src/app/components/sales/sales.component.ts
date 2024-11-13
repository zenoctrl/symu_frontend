import { Component, ViewChild } from '@angular/core';
import { AfterSalesComponent } from './after-sales/after-sales.component';
import { PostedSalesComponent } from './posted-sales/posted-sales.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent {
  @ViewChild(AfterSalesComponent) afterSalesComponent!: AfterSalesComponent;
  @ViewChild(PostedSalesComponent) postedSalesComponent!: PostedSalesComponent;

  handleCompleteEvent() {
    this.afterSalesComponent.getPhones();
  }

  handlePostEvent() {
    this.postedSalesComponent.getPhones();
  }
}
