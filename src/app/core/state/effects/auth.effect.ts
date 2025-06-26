import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '../actions/auth.action';
import { ErrorActions } from '../actions/error.action';
import { AuthService } from '../../../services/auth.service';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../../../services/token.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((response) =>
            AuthActions.loginSuccess({
              user: response.user,
              token: response.token,
            })
          ),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              error.error?.message || error.error?.error || 'Login failed';
            return of(
              ErrorActions.addError({
                errorType: 'auth',
                message: errorMessage,
              }),
              AuthActions.loginFailure({
                error: errorMessage,
              })
            );
          })
        )
      )
    );
  });

  signup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap(({ username, password, email }) =>
        this.authService.signup(username, email, password).pipe(
          map((response) => {
            console.log('Signup response:', response);
            return AuthActions.signupSuccess({
              user: response.user,
              token: response.token,
              signupSuccess: true,
              loginSuccess: false,
            });
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage =
              error.error?.message || error.error?.error || 'Signup failed';
            return of(
              ErrorActions.addError({
                errorType: 'auth',
                message: errorMessage,
              })
              // AuthActions.signupFailure({
              //   error: errorMessage,
              // })
            );
          })
        )
      )
    );
  });
}
