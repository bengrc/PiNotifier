import { TestBed } from '@angular/core/testing';

import { MicrosoftAuthService } from './microsoft_auth.service';

describe('AuthService', () => {
  let service: MicrosoftAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicrosoftAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
