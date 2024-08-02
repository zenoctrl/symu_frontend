import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneModalComponent } from './phone-modal.component';

describe('PhoneModalComponent', () => {
  let component: PhoneModalComponent;
  let fixture: ComponentFixture<PhoneModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneModalComponent]
    });
    fixture = TestBed.createComponent(PhoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
