import { AuthStatus } from '@auth/interfaces/auth-status.enum';
import { User } from '@auth/interfaces/responses/user.interface';

export interface AuthState {
  user: User | null;
  status: AuthStatus;
}
