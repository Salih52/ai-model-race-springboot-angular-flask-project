import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NglAssignComponent } from './ngl-assign.component';

describe('NglAssignComponent', () => {
  let component: NglAssignComponent;
  let fixture: ComponentFixture<NglAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NglAssignComponent]
    });
    fixture = TestBed.createComponent(NglAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
