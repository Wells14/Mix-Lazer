import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { analyticsConfig } from '@/config/analytics';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationStore } from '@/stores/notificationStore';
import { Settings, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NotificationSettings } from '@/components/NotificationSettings';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actions?: { label: string; action: string }[];
}

export function NotificationBell() {
  const {
    notifications,
    settings,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationStore();

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = settings.showOnlyUnread
    ? notifications.filter(n => !n.read)
    : notifications;

  useEffect(() => {
    if (!window.Pusher) {
      console.error('Pusher não está carregado');
      return;
    }

    // Solicitar permissão para notificações desktop
    if (settings.desktopNotifications) {
      Notification.requestPermission();
    }

    try {
      const pusher = new window.Pusher(analyticsConfig.pusher.key, {
        cluster: analyticsConfig.pusher.cluster,
        encrypted: true
      });

      const channel = pusher.subscribe('notifications');

      channel.bind('new-notification', (data: any) => {
        // Reproduz som se habilitado
        if (settings.soundEnabled) {
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(console.error);
        }

        // Mostra notificação desktop se habilitado
        if (settings.desktopNotifications && Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/logo.png'
          });
        }
      });

      return () => {
        pusher.unsubscribe('notifications');
      };
    } catch (error) {
      console.error('Erro ao configurar Pusher:', error);
    }
  }, [settings]);

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Notificações</h3>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <NotificationSettings />
                </SheetContent>
              </Sheet>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>
          
          <ScrollArea className="h-[300px]">
            {displayedNotifications.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma notificação
              </p>
            ) : (
              <div className="space-y-2">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-muted/50' : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <span className="sr-only">Marcar como lida</span>
                            <span className="h-2 w-2 bg-blue-500 rounded-full" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {notification.actions && (
                      <div className="flex gap-2 mt-2">
                        {notification.actions.map((action) => (
                          <Button
                            key={action.label}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Implementar ações específicas aqui
                              console.log(action.action, notification);
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
