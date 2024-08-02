import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneListComponent } from './phone-list.component';

describe('PhoneListComponent', () => {
  let component: PhoneListComponent;
  let fixture: ComponentFixture<PhoneListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneListComponent]
    });
    fixture = TestBed.createComponent(PhoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
