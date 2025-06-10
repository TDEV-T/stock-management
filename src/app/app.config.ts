import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { authReducer } from './core/state/reducers/auth.reducer';
import { errorReducer } from './core/state/reducers/error.reducer';
import { environment } from './environments/environment';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './core/state/effects/auth.effect';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      errors: errorReducer,
    }),
    provideEffects(AuthEffects),
    provideHttpClient(withFetch()),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !environment.production,
    }),
  ],
};
