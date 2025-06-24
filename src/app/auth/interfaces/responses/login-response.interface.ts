import { User } from '@auth/interfaces/responses/user.interface';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
