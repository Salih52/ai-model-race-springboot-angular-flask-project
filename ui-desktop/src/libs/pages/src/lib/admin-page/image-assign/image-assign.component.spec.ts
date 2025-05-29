import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAssignComponent } from './image-assign.component';

describe('ImageAssignComponent', () => {
  let component: ImageAssignComponent;
  let fixture: ComponentFixture<ImageAssignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageAssignComponent]
    });
    fixture = TestBed.createComponent(ImageAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
