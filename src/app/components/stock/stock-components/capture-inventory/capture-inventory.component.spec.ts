import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureInventoryComponent } from './capture-inventory.component';

describe('CaptureInventoryComponent', () => {
  let component: CaptureInventoryComponent;
  let fixture: ComponentFixture<CaptureInventoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptureInventoryComponent]
    });
    fixture = TestBed.createComponent(CaptureInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
