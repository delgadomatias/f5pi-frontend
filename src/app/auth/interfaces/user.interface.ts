export interface User {
  email: string;
  fullName: string;
  id: string;
  role: 'USER' | 'ADMIN';
  username: string;
}
