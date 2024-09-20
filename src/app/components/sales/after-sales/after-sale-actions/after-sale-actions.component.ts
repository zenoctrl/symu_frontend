import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';


@Component({
  selector: 'app-after-sale-actions',
  templateUrl: './after-sale-actions.component.html',
  styleUrls: ['./after-sale-actions.component.scss'],
})
export class AfterSaleActionsComponent implements ICellRendererAngularComp {

  params: any

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  update($event: Event) {
    if (this.params.update instanceof Function) {
      this.params.update(this.params.node.data);
    }
  }
}
