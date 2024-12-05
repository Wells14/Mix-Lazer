export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high';
export type NotificationCategory = 'general' | 'orders' | 'system' | 'updates';

export interface NotificationAction {
  label: string;
  action: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  actions?: NotificationAction[];
}

export interface NotificationSettings {
  soundEnabled: boolean;
  desktopNotifications: boolean;
  showOnlyUnread: boolean;
  maxNotifications: number;
}

export interface NotificationStore {
  notifications: Notification[];
  settings: NotificationSettings;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
}
