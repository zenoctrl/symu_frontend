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

  update(event: Event) {
    if (this.params.update instanceof Function) {
      const params = {
        event: event,
        phone: this.params.node.data,
        title: (event.target as HTMLAnchorElement).textContent,
      };
      this.params.update(params);
    }
  }
}
