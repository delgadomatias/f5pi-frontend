import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap, timeout } from 'rxjs';

import { ClientStorageService } from '@common/client-storage.service.abstract';
import { environment } from '@environments/environment';

interface User {
  email: string;
  fullName: string;
  id: string;
  role: 'USER' | 'ADMIN';
  username: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  status: AuthStatus;
}

export enum AuthStatus {
  AUTHENTICATED,
  PENDING,
  UNAUTHENTICATED,
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storage = inject(ClientStorageService);
  private http = inject(HttpClient);
  private state = signal<AuthState>({ accessToken: null, refreshToken: null, user: null, status: AuthStatus.PENDING });
  accessToken = computed(() => this.state().accessToken);
  refreshToken = computed(() => this.state().refreshToken);
  status = computed(() => this.state().status);
  user = computed(() => this.state().user);

  constructor() {
    this.checkStatus().subscribe({
      next: (user) => {
        const status = user ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED;
        const { accessToken, refreshToken } = this.getTokens();
        this.state.set({ accessToken, refreshToken, user, status });
      },
      error: () => {
        this.state.set({ accessToken: null, refreshToken: null, user: null, status: AuthStatus.UNAUTHENTICATED });
        this.logout();
      },
    });
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response) => {
        const { accessToken, refreshToken, user } = response;
        this.state.set({ accessToken, refreshToken, user, status: AuthStatus.AUTHENTICATED });
        this.setTokens(accessToken, refreshToken);
      })
    );
  }

  checkStatus(): Observable<User | null> {
    const accessToken = this.storage.get<string>('accessToken');
    if (!accessToken) return of(null);
    return this.http.post<User>(`${environment.apiUrl}/auth/check-token`, { accessToken }).pipe(timeout(5000));
  }

  logout(): void {
    this.state.set({ accessToken: null, refreshToken: null, user: null, status: AuthStatus.UNAUTHENTICATED });
    this.clearTokens();
  }

  private clearTokens(): void {
    this.storage.remove('accessToken');
    this.storage.remove('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.storage.set('accessToken', accessToken);
    this.storage.set('refreshToken', refreshToken);
  }

  private getTokens(): { accessToken: string | null; refreshToken: string | null } {
    return {
      accessToken: this.storage.get<string>('accessToken'),
      refreshToken: this.storage.get<string>('refreshToken'),
    };
  }
}
