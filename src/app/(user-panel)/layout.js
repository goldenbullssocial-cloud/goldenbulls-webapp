'use client'
import Sidebar from '@/components/sidebar'
import UserHeader from '@/components/userHeader'
import React, { useEffect, useState } from 'react'
import { getSocket } from '@/utils/webSocket'
import MobileHeader from '@/components/mobileHeader'
import { SearchProvider, useSearch } from '@/contexts/SearchContext'
import { usePathname, useRouter } from 'next/navigation'
import { getCookie } from '../../../cookie'
import toast from 'react-hot-toast'
import InactivityLogout from '@/components/inactivityLogout'

function LayoutContent({ children }) {
    const [toogle, setToogle] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { searchQuery, handleSearchChange, handleSearch, clearSearch } = useSearch();
    const pathname = usePathname();
    const router = useRouter();

    // Check authentication on mount and route changes
    useEffect(() => {
        const checkAuth = () => {
            const userToken = getCookie('userToken');
            const user = getCookie('user');

            if (!userToken || !user) {
                toast.error('Please login to access this page');
                window.location.href = '/';
                return;
            }

            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
        clearSearch();
    }, [pathname, router, clearSearch]);

    // Handle browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => {
            const userToken = getCookie('userToken');
            const user = getCookie('user');

            if (!userToken || !user) {
                window.location.href = '/';
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [router]);

    useEffect(() => {
        if (!isAuthenticated) return;

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
    }, [isAuthenticated]);

    // Show loading or redirect if not authenticated
    if (isLoading || !isAuthenticated) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#000'
            }}>
                <div style={{ color: '#fff', fontSize: '18px' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div className='user-panel-layout'>
            <InactivityLogout />
            <MobileHeader />
            <div className='sidebar-panel'>
                <Sidebar toogle={toogle} setToogle={setToogle} unreadCount={unreadCount} />
            </div>
            <div className='children-layout'>
                <UserHeader
                    searchValue={searchQuery}
                    onSearchChange={handleSearchChange}
                    onSearch={handleSearch}
                />
                {children}
            </div>
        </div>
    )
}

export default function Layout({ children }) {
    return (
        <SearchProvider>
            <LayoutContent>{children}</LayoutContent>
        </SearchProvider>
    )
}
