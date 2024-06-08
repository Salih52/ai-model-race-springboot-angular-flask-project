import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAssignComponent } from './new-assign.component';

describe('NewAssignComponent', () => {
  let component: NewAssignComponent;
  let fixture: ComponentFixture<NewAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAssignComponent]
    });
    fixture = TestBed.createComponent(NewAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
