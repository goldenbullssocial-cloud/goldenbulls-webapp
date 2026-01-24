"use client";
import React, { useEffect, useState } from 'react'
import styles from './notifications.module.scss';
import { useRouter } from 'next/navigation';
import { getNotification, updateNotification } from '@/services/notification';
import { getSocket } from '@/utils/webSocket';
import { formatDistanceToNow } from 'date-fns';
const CheckIcon = '/assets/icons/check.svg';
const NotificationIcon = '/assets/icons/notification.svg';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await getNotification();
            if (response?.payload?.data) {
                setNotifications(response.payload.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await updateNotification(notification._id, true);

                // Update local state
                setNotifications(prev => prev.map(n =>
                    n._id === notification._id ? { ...n, isRead: true } : n
                ));

                // Emit socket event to update unread count in sidebar
                const socket = getSocket();
                if (socket) {
                    socket.emit('check-notification', {});
                }
            }

            if (notification.link) {
                router.push(notification.link);
            }
        } catch (error) {
            console.error('Error updating notification status:', error);
        }
    };

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    // const markAllAsRead = async () => {
    //     try {
    //         // Mark all notifications as read in a single API call
    //         const result = await updateNotification();

    //         if (result?.error) {
    //             console.error('Failed to mark notifications as read:', result.message);
    //             return;
    //         }

    //         // Just emit the socket event to update unread count in real-time
    //         const socket = getSocket();
    //         if (socket) {
    //             socket.emit('check-notification', {});
    //         }
    //     } catch (error) {
    //         console.error('Error marking all notifications as read:', error);
    //         // Don't throw the error to prevent automatic logout
    //     }
    // };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Mark all notifications as read when component mounts
    // useEffect(() => {
    //     if (notifications.length > 0 && notifications.some(n => !n.isRead)) {
    //         markAllAsRead();
    //     }
    // }, [notifications]); // This will run after the initial fetch

    // const handleMarkAsRead = async (notificationId) => {
    //     try {
    //         await updateNotification(notificationId, true);
    //         // Update local state to reflect read status
    //         setNotifications(prev => prev.map(n =>
    //             n._id === notificationId ? { ...n, isRead: true } : n
    //         ));

    //         // Emit check-notification event to update unread count
    //         const socket = getSocket();
    //         if (socket) {
    //             socket.emit('check-notification', {});
    //         }
    //     } catch (error) {
    //         console.error('Error updating notification status:', error);
    //     }
    // };

    return (
        <div className={styles.notifications}>
            <div className={styles.title}>
                <h2>
                    Notifications
                </h2>
            </div>
            <div className={styles.allBoxAlignment}>
                {
                    notifications?.map((notification) => {
                        return (
                            <div
                                className={styles.box}
                                key={notification?._id}
                                onClick={() => handleNotificationClick(notification)}
                                style={{ cursor: (!notification.isRead || notification.link) ? 'pointer' : 'default' }}
                            >
                                <div className={styles.boxHeader}>
                                    <div className={styles.leftAlignment}>
                                        <img
                                            src={notification?.isRead ? CheckIcon : NotificationIcon}
                                            alt={notification?.isRead ? 'CheckIcon' : 'NotificationIcon'}
                                        />
                                        <h4>
                                            {notification?.title}
                                        </h4>
                                    </div>
                                    <span>
                                        {getTimeAgo(notification?.createdAt)}
                                    </span>
                                </div>
                                <p>
                                    {notification.description}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
