import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterSaleActionsComponent } from './after-sale-actions.component';

describe('AfterSaleActionsComponent', () => {
  let component: AfterSaleActionsComponent;
  let fixture: ComponentFixture<AfterSaleActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfterSaleActionsComponent]
    });
    fixture = TestBed.createComponent(AfterSaleActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
