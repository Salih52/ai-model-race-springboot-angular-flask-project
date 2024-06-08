import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAssignsPageComponent } from './all-assigns-page.component';

describe('AllAssignsPageComponent', () => {
  let component: AllAssignsPageComponent;
  let fixture: ComponentFixture<AllAssignsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllAssignsPageComponent]
    });
    fixture = TestBed.createComponent(AllAssignsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
