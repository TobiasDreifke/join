import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { reverseAuthFunctionalGuardGuard } from './reverse-auth-functional-guard-guard';

describe('reverseAuthFunctionalGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => reverseAuthFunctionalGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
