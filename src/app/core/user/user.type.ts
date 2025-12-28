export type UserRole = 'admin' | 'user' | 'manager';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phoneNumber: string;
  country?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
}
