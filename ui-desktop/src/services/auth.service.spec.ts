import { TestBed } from '@angular/core/testing';

import { VeriService } from './auth.service';

describe('VeriService', () => {
  let service: VeriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VeriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
