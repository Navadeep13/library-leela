import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Notification } from '@/types';

const NotificationPanel = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    
    // Get user-specific notifications
    const userNotifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
    
    // Generate sample notifications for demo
    if (userNotifications.length === 0) {
      const sampleNotifications: Notification[] = [
        {
          id: 'notif-1',
          userId: user.id,
          type: 'due_reminder',
          title: 'Book Due Reminder',
          message: 'Your book "Rich Dad Poor Dad" is due in 2 days.',
          isRead: false,
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 'notif-2',
          userId: user.id,
          type: 'overdue_alert',
          title: 'Overdue Book Alert',
          message: 'Your book "Think and Grow Rich" is overdue. Please return it to avoid fine.',
          isRead: false,
          createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        },
        {
          id: 'notif-3',
          userId: user.id,
          type: 'return_success',
          title: 'Book Returned Successfully',
          message: 'Thank you for returning "The Alchemist" on time.',
          isRead: true,
          createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        }
      ];
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(sampleNotifications));
      setNotifications(sampleNotifications);
    } else {
      setNotifications(userNotifications);
    }
  };

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'due_reminder':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue_alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'return_success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fine_notice':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive rounded-full text-xs flex items-center justify-center text-white font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-border last:border-b-0 transition-colors ${
                  !notification.isRead ? 'bg-muted/30' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <div className="flex items-center space-x-1">
                        {!notification.isRead && (
                          <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationPanel;