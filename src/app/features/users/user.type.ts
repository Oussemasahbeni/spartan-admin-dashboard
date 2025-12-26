export interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}
