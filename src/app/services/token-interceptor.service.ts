import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../core/state/app.state';
import { selectAuthToken } from '../core/state/selectors/auth.selector';
import { switchMap, take } from 'rxjs';
import { TokenService } from './token.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store<AppState>);
  const tokenService = inject(TokenService);
  
  // First check localStorage
  const storedToken = tokenService.getToken();
  if (storedToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    return next(cloned);
  }

  // If no stored token, check store
  return store.select(selectAuthToken).pipe(
    take(1),
    switchMap((token) => {
      if (token) {
        // Save token to localStorage when we get it from store
        tokenService.setToken(token);
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(cloned);
      }
      return next(req);
    })
  );
};
