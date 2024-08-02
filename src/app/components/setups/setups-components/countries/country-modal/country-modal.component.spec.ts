import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryModalComponent } from './country-modal.component';

describe('CountryModalComponent', () => {
  let component: CountryModalComponent;
  let fixture: ComponentFixture<CountryModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryModalComponent]
    });
    fixture = TestBed.createComponent(CountryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
