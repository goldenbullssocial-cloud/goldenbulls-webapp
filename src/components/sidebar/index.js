"use client";
import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './sidebar.module.scss';
import toast from 'react-hot-toast';
import UserIcon from '@/icons/userIcon';
import DownIcon from '@/icons/downIcon';
import UpIcon from '@/icons/upIcon';
import LibraryIcon from '@/icons/libraryIcon';
import CoursesIcon from '@/icons/coursesIcon';
import AlgobotsIcon from '@/icons/algobotsIcon';
import NotificationsIcon from '@/icons/notificationsIcon';
import PaymentIcon from '@/icons/paymentIcon';
import ReferIcon from '@/icons/referIcon';
import classNames from 'classnames';
const Logo = '/assets/logo/logo.svg';
const ProfileIcon = '/assets/icons/profileIcon.svg';
const LogoutIcon = '/assets/icons/logoutIcon.svg';
import { getCookie, removeCookie } from '../../../cookie';
import Link from 'next/link';
import { getSocket } from '@/utils/webSocket';

export default function Sidebar({ unreadCount, toogle, setToogle }) {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const user = getCookie('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            const userName = `${parsedUser.firstName} ${parsedUser.lastName}`;
            setUser(userName);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const pathname = usePathname();
    const isActive = (path) => pathname === path;

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            removeCookie("userToken");
            removeCookie("user");
            toast.success("Logout successfully.");
            await router.push('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    return (
        <aside className={`${styles.sidebar} ${toogle ? styles.open : ''}`}>
            <div className={styles.sidebarlogo}>
                <Link href='/'>
                    <img src={Logo} alt='Logo' />
                </Link>
            </div>
            <div className={styles.asideBody}>
                <Link href='/library' className={classNames({ [styles.active]: isActive('/library') }, styles.menu)}>
                    <LibraryIcon />
                    <span>
                        My Library
                    </span>
                </Link>
                <Link href='/recorded-courses' className={classNames({ [styles.active]: isActive('/recorded-courses') }, styles.menu)}>
                    <CoursesIcon />
                    <span>
                        Courses
                    </span>
                </Link>
                <Link href='/algobots' className={classNames({ [styles.active]: isActive('/algobots') }, styles.menu)}>
                    <AlgobotsIcon />
                    <span>
                        Algobots
                    </span>
                </Link>
                <Link href='/notifications' className={classNames({ [styles.active]: isActive('/notifications') }, styles.menu)}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <NotificationsIcon />
                        {unreadCount >= 0 && (
                            <span className={styles.notificationBadge}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <span>
                        Notifications
                    </span>
                </Link>
                <Link href='/payment-history' className={classNames({ [styles.active]: isActive('/payment-history') }, styles.menu)}>
                    <PaymentIcon />
                    <span>
                        Payment History
                    </span>
                </Link>
                <Link href='/refer-and-earn' className={classNames({ [styles.active]: isActive('/refer-and-earn') }, styles.menu)}>
                    <ReferIcon />
                    <span>
                        Refer and Earn
                    </span>
                </Link>
            </div>
            <div className={styles.asideFooter} ref={dropdownRef}>
                {isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                        <Link href="/profile" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                            <img src={ProfileIcon} alt="Profile" />
                            <span>Profile</span>
                        </Link>
                        <div className={styles.divider}></div>
                        <div className={styles.dropdownItem} onClick={handleLogout}>
                            <img src={LogoutIcon} alt="Logout" />
                            <span>Logout</span>
                        </div>
                    </div>
                )}
                <div
                    className={classNames(styles.profileBox, { [styles.active]: isDropdownOpen })}
                    onClick={toggleDropdown}
                >
                    <div className={styles.profile}>
                        <UserIcon />
                    </div>
                    <div className={styles.textgrid}>
                        <span>
                            {user}
                        </span>
                        <div className={classNames(styles.arrow, { [styles.open]: isDropdownOpen })}>
                            <UpIcon />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
