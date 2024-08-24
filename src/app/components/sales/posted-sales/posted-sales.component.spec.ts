import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedSalesComponent } from './posted-sales.component';

describe('PostedSalesComponent', () => {
  let component: PostedSalesComponent;
  let fixture: ComponentFixture<PostedSalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostedSalesComponent]
    });
    fixture = TestBed.createComponent(PostedSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
