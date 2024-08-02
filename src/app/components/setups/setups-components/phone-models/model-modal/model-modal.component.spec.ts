import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelModalComponent } from './model-modal.component';

describe('ModelModalComponent', () => {
  let component: ModelModalComponent;
  let fixture: ComponentFixture<ModelModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModelModalComponent]
    });
    fixture = TestBed.createComponent(ModelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
