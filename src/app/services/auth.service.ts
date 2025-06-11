import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../core/state/app.state';
import { TokenService } from './token.service';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private tokenService: TokenService
  ) {}

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.tokenService.setToken(response.token);
        }
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
    });
  }

  logout() {
    this.tokenService.removeToken();
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasToken();
  }
}
