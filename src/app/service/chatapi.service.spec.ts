import { TestBed } from '@angular/core/testing';

import { ChatapiService } from './chatapi.service';

describe('ChatapiService', () => {
  let service: ChatapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
