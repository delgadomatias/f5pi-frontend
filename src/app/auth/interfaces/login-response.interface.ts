import { User } from '@auth/interfaces/user.interface';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
