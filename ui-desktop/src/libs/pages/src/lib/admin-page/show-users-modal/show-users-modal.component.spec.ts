import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowUsersModalComponent } from './show-users-modal.component';

describe('ShowUsersModalComponent', () => {
  let component: ShowUsersModalComponent;
  let fixture: ComponentFixture<ShowUsersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowUsersModalComponent]
    });
    fixture = TestBed.createComponent(ShowUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
