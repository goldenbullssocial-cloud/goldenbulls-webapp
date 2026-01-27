"use client";
import React, { useEffect, useState } from 'react'
import styles from './notifications.module.scss';
import { useRouter } from 'next/navigation';
import { getNotification, updateNotification } from '@/services/notification';
import { getSocket } from '@/utils/webSocket';
import { formatDistanceToNow } from 'date-fns';
import classNames from 'classnames';
const CheckIcon = '/assets/icons/check.svg';
const NotificationIcon = '/assets/icons/notification.svg';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const notificationsRef = React.useRef(notifications);
    const router = useRouter();

    React.useEffect(() => {
        notificationsRef.current = notifications;
    }, [notifications]);

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

    const getTimeAgo = (dateString) => {
        if (!dateString) return '';
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    const markAllAsRead = async () => {
        try {
            const hasUnread = notificationsRef.current.some(n => !n.isRead);
            if (!hasUnread) return;

            await updateNotification(null, true); // backend marks all read

            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true }))
            );

            const socket = getSocket();
            socket?.emit('check-notification', {});
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                markAllAsRead();
            }
        };

        const handleBeforeUnload = () => {
            markAllAsRead();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            markAllAsRead(); 
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []); 

    useEffect(() => {
        fetchNotifications();
    }, []);

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
                                className={classNames(styles.box, { [styles.read]: notification?.isRead })}
                                key={notification?._id}
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
