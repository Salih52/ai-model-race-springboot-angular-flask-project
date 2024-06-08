import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YuklemeComponent } from './yukleme.component';

describe('YuklemeComponent', () => {
  let component: YuklemeComponent;
  let fixture: ComponentFixture<YuklemeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YuklemeComponent]
    });
    fixture = TestBed.createComponent(YuklemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
