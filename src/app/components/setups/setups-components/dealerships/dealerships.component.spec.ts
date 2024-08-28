import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealershipsComponent } from './dealerships.component';

describe('DealershipsComponent', () => {
  let component: DealershipsComponent;
  let fixture: ComponentFixture<DealershipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DealershipsComponent]
    });
    fixture = TestBed.createComponent(DealershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
