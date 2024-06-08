import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAssignModalComponent } from './admin-assign-modal.component';

describe('AdminAssignModalComponent', () => {
  let component: AdminAssignModalComponent;
  let fixture: ComponentFixture<AdminAssignModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminAssignModalComponent]
    });
    fixture = TestBed.createComponent(AdminAssignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
