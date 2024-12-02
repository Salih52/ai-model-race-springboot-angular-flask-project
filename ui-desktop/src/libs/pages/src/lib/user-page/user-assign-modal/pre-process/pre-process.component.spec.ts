import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreProcessComponent } from './pre-process.component';

describe('PreProcessComponent', () => {
  let component: PreProcessComponent;
  let fixture: ComponentFixture<PreProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreProcessComponent]
    });
    fixture = TestBed.createComponent(PreProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
