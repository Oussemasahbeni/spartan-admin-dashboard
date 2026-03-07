export const USER_ROLES = ['admin', 'user', 'manager'] as const;
export const USER_STATUSES = ['active', 'inactive', 'pending'] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type UserStatus = (typeof USER_STATUSES)[number];

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
