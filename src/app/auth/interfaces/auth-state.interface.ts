import { AuthStatus } from '@auth/interfaces/auth-status.enum';
import { User } from '@auth/interfaces/user.interface';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  status: AuthStatus;
}
