export type UserRole = 'admin' | 'user' | 'manager';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}
