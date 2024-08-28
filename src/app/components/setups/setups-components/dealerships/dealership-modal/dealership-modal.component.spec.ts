import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealershipModalComponent } from './dealership-modal.component';

describe('DealershipModalComponent', () => {
  let component: DealershipModalComponent;
  let fixture: ComponentFixture<DealershipModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealershipModalComponent]
    });
    fixture = TestBed.createComponent(DealershipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
