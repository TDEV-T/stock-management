import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenService);
  const router = inject(Router);

  if (tokenStorage.getToken() == null) {
    return false;
  } else {
    return true;
  }
};
