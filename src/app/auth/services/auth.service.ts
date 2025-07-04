import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { Observable, tap, throwError, timeout } from 'rxjs';

import { AUTH_CONSTANTS } from '@auth/auth.constants';
import { AuthState } from '@auth/interfaces/auth-state.interface';
import { AuthStatus } from '@auth/interfaces/auth-status.enum';
import { CreateUserRequest } from '@auth/interfaces/requests/create-user-request.interface';
import { LoginRequest } from '@auth/interfaces/requests/login-request.interface';
import { LoginResponse } from '@auth/interfaces/responses/login-response.interface';
import { User } from '@auth/interfaces/responses/user.interface';
import { ROUTES_PATHS } from '@common/common.constants';

const INITIAL_STATE: AuthState = {
  user: null,
  status: AuthStatus.PENDING,
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly cookieService = inject(SsrCookieService);
  private readonly http = inject(HttpClient);
  private readonly state = signal<AuthState>(INITIAL_STATE);

  status = computed(() => this.state().status);
  user = computed(() => this.state().user);

  constructor() {
    this.checkStatus().subscribe({
      next: (user) => {
        this.state.set({ user, status: AuthStatus.AUTHENTICATED });
      },
      error: () => {
        this.state.set({ ...INITIAL_STATE, status: AuthStatus.UNAUTHENTICATED });
      },
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(ROUTES_PATHS.LOGIN, credentials).pipe(
      tap((response) => {
        const { accessToken, refreshToken, user } = response;
        this.state.set({ user, status: AuthStatus.AUTHENTICATED });
        this.setTokens(accessToken, refreshToken);
      })
    );
  }

  register(credentials: CreateUserRequest) {
    return this.http.post<void>(ROUTES_PATHS.REGISTER, credentials);
  }

  logout(): void {
    this.clearTokens();
  }

  getUserId(): string {
    const userId = this.user()?.id;
    if (!userId) throw new Error(AUTH_CONSTANTS.UNAUTHENTICATED_USER_ERROR_MESSAGE);
    return userId;
  }

  private checkStatus(): Observable<User> {
    const { accessToken } = this.getTokens();
    if (!accessToken) return throwError(() => new Error(AUTH_CONSTANTS.UNAUTHENTICATED_USER_ERROR_MESSAGE));

    return this.http.post<User>(ROUTES_PATHS.CHECK_TOKEN, { accessToken }).pipe(timeout(5000));
  }

  private clearTokens(): void {
    this.cookieService.delete(AUTH_CONSTANTS.ACCESS_TOKEN_STORAGE_NAME);
    this.cookieService.delete(AUTH_CONSTANTS.REFRESH_TOKEN_STORAGE_NAME);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.cookieService.set(AUTH_CONSTANTS.ACCESS_TOKEN_STORAGE_NAME, accessToken, { path: '/' });
    this.cookieService.set(AUTH_CONSTANTS.REFRESH_TOKEN_STORAGE_NAME, refreshToken, { path: '/' });
  }

  private getTokens() {
    return {
      accessToken: this.cookieService.get(AUTH_CONSTANTS.ACCESS_TOKEN_STORAGE_NAME),
      refreshToken: this.cookieService.get(AUTH_CONSTANTS.REFRESH_TOKEN_STORAGE_NAME),
    };
  }
}
