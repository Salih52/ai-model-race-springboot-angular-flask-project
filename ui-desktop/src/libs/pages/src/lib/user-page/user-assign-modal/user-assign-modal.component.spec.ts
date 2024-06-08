import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAssignModalComponent } from './user-assign-modal.component';

describe('UserAssignModalComponent', () => {
  let component: UserAssignModalComponent;
  let fixture: ComponentFixture<UserAssignModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAssignModalComponent]
    });
    fixture = TestBed.createComponent(UserAssignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
