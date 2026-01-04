export interface Notification {
  user: string;
  action: string;
  subject: string;
  date: Date;
  unread: boolean;
  avatar: string;
}
