'use client'
import Sidebar from '@/components/sidebar'
import UserHeader from '@/components/userHeader'
import React, { useEffect, useState } from 'react'
import { getSocket } from '@/utils/webSocket'
import MobileHeader from '@/components/mobileHeader'

export default function Layout({ children }) {
    const [toogle, setToogle] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const socket = getSocket();

        const handleCheckNotification = (data) => {
            const count = data?.data ?? data?.unreadNotification ?? data?.unreadCount ?? 0;
            setUnreadCount(count);
        };

        if (socket) {
            const handleConnect = () => {
                socket.emit("check-notification", {});
            };

            socket.on("connect", handleConnect);
            socket.on("check-notification", handleCheckNotification);

            // Also listen to the other events for compatibility
            socket.on('notification-count', handleCheckNotification);
            socket.on('get-count', handleCheckNotification);

            if (socket.connected) {
                handleConnect();
            }

            return () => {
                socket.off("connect", handleConnect);
                socket.off("check-notification", handleCheckNotification);
                socket.off('notification-count', handleCheckNotification);
                socket.off('get-count', handleCheckNotification);
            };
        }
    }, []);

    return (
        <div className='user-panel-layout'>
            <MobileHeader />
            <div className='sidebar-panel'>
                <Sidebar toogle={toogle} setToogle={setToogle} unreadCount={unreadCount} />
            </div>
            <div className='children-layout'>
                <UserHeader />
                {children}
            </div>
        </div>
    )
}
