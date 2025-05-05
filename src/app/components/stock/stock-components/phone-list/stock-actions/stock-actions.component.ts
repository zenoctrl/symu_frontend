import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-stock-actions',
  templateUrl: './stock-actions.component.html',
  styleUrls: ['./stock-actions.component.scss'],
})
export class StockActionsComponent implements ICellRendererAngularComp {
  params: any;
  canEdit!: boolean;

  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    const role = user.roleModel.roleName;
    if (role.toLowerCase().includes('director') || role.toLowerCase().includes('admin') ) {
      this.canEdit = true;
    }
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  update($event: Event, title: string) {
    if (this.params.update instanceof Function) {
      const params = {
        event: $event,
        phone: this.params.node.data,
        title: title
      };
      this.params.update(params);
    }
  }
}

