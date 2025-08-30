export type NotificationDto = {
  id: number;
  message: string;
  createdAt: string;
};

export type NotificationState = {
  notifications: NotificationDto[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
};