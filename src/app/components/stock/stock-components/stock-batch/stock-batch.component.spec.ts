import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBatchComponent } from './stock-batch.component';

describe('StockBatchComponent', () => {
  let component: StockBatchComponent;
  let fixture: ComponentFixture<StockBatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockBatchComponent]
    });
    fixture = TestBed.createComponent(StockBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
