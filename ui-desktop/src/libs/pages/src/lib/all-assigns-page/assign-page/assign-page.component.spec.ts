import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPageComponent } from './assign-page.component';

describe('AssignPageComponent', () => {
  let component: AssignPageComponent;
  let fixture: ComponentFixture<AssignPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignPageComponent]
    });
    fixture = TestBed.createComponent(AssignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
