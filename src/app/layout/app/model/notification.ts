export interface Notification {
  id: string;
  user: string;
  action: string;
  subject: string;
  date: Date;
  unread: boolean;
  avatar: string;
}
