import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryModalComponent } from './inventory-modal.component';

describe('InventoryModalComponent', () => {
  let component: InventoryModalComponent;
  let fixture: ComponentFixture<InventoryModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryModalComponent]
    });
    fixture = TestBed.createComponent(InventoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
