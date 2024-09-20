import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockActionsComponent } from './stock-actions.component';

describe('StockActionsComponent', () => {
  let component: StockActionsComponent;
  let fixture: ComponentFixture<StockActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockActionsComponent]
    });
    fixture = TestBed.createComponent(StockActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
