import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignModalComponent } from './assign-modal.component';

describe('AssignModalComponent', () => {
  let component: AssignModalComponent;
  let fixture: ComponentFixture<AssignModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignModalComponent]
    });
    fixture = TestBed.createComponent(AssignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
