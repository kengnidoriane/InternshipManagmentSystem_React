import { create } from 'zustand';
import { getUnseenNotifications, markNotificationAsSeen } from '../api/notificationApi';

type NotificationDto = {
  id: number;
  message: string;
  createdAt: string;
};

interface NotificationStore {
  notifications: NotificationDto[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsSeen: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getUnseenNotifications();
      const notifications = response.data || [];
      set({ 
        notifications,
        unreadCount: notifications.length,
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erreur lors du chargement des notifications',
        loading: false 
      });
    }
  },

  markAsSeen: async (id: number) => {
    console.log('=== MARQUAGE NOTIFICATION ===');
    console.log('ID notification:', id);
    try {
      const response = await markNotificationAsSeen(id);
      console.log('Réponse API:', response);
      const { notifications } = get();
      console.log('Notifications avant filtrage:', notifications);
      const updatedNotifications = notifications.filter(n => n.id !== id);
      console.log('Notifications après filtrage:', updatedNotifications);
      set({ 
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.length 
      });
    } catch (error: any) {
      console.error('Erreur marquage notification:', error);
      set({ error: error.message || 'Erreur lors du marquage de la notification' });
    }
  },

  clearError: () => set({ error: null })
}));