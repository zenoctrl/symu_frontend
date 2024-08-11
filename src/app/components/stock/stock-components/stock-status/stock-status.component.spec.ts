import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockStatusComponent } from './stock-status.component';

describe('StockStatusComponent', () => {
  let component: StockStatusComponent;
  let fixture: ComponentFixture<StockStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockStatusComponent]
    });
    fixture = TestBed.createComponent(StockStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
