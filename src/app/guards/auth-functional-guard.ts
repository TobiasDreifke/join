import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { authState } from '@angular/fire/auth';
import { map } from 'rxjs';

export const authFunctionalGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authState(authService.auth).pipe(
    map(user => {
      if (user) return true;                    
      return router.createUrlTree(['/login']);  
    })
  );
};
