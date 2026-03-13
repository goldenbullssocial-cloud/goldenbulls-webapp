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
import ResourcesIcon from '@/icons/resourcesIcon';
import classNames from 'classnames';
const Logo = '/assets/logo/logo.svg';
const ProfileIcon = '/assets/icons/profileIcon.svg';
const LogoutIcon = '/assets/icons/logoutIcon.svg';
import { getCookie, removeCookie } from '../../../cookie';
import Link from 'next/link';
import { getSocket } from '@/utils/webSocket';
import { getProfile } from '@/services/dashboard';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ unreadCount, toogle, setToogle }) {
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    const { profile, completionPercentage } = useAuth();


    useEffect(() => {
        if (profile) {
            const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
            setUser(fullName || profile.firstName || 'User');
            setProfileImage(profile.profileImage || null);
        } else {
            // Fallback to cookie if profile isn't loaded yet in context
            const userCookie = getCookie('user');
            if (userCookie) {
                try {
                    const parsedUser = JSON.parse(userCookie);
                    setUser(parsedUser.firstName || 'User');
                } catch (e) {}
            }
        }
    }, [profile]);

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
            // Clear all authentication data
            removeCookie("userToken");
            removeCookie("user");

            // Clear auth-related data but preserve "Remember Me" credentials
            if (typeof window !== 'undefined') {
                const rememberMe = localStorage.getItem("rememberMe");
                const rememberedEmail = localStorage.getItem("rememberedEmail");
                const rememberedPassword = localStorage.getItem("rememberedPassword");

                localStorage.clear();
                sessionStorage.clear();

                // Restore remember me data if it was set
                if (rememberMe) localStorage.setItem("rememberMe", rememberMe);
                if (rememberedEmail) localStorage.setItem("rememberedEmail", rememberedEmail);
                if (rememberedPassword) localStorage.setItem("rememberedPassword", rememberedPassword);
            }

            toast.dismiss();
            toast.success("Logout successfully.");

            // Use window.location.href to ensure complete page reload and clear history
            window.location.href = '/login';
        } catch (error) {
            console.error('Failed to log out', error);
            // Fallback to router push if window.location fails
            await router.push('/login');
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
                        Marketplace
                    </span>
                </Link>
                <Link href='/notifications' className={classNames({ [styles.active]: isActive('/notifications') }, styles.menu)}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <NotificationsIcon />
                        {unreadCount > 0 && (
                            <span className={styles.notificationBadge}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <span>
                        Updates
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
                <Link href='/resources' className={classNames({ [styles.active]: isActive('/resources') }, styles.menu)}>
                    <ResourcesIcon />
                    <span>
                        Resources
                    </span>
                </Link>
            </div>
            <div className={styles.asideFooter} ref={dropdownRef}>
                {isDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                        <Link href="/profile" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                            <div>
                                <img src={ProfileIcon} alt="Profile" />
                                <span>Profile</span>
                            </div>
                            {completionPercentage < 100 && (
                                <div className={styles.alertBadge}>!</div>
                            )}
                        </Link>
                        <div className={styles.divider}></div>
                        <div className={styles.dropdownItem} onClick={handleLogout}>
                            <div>
                                <img src={LogoutIcon} alt="Logout" />
                                <span>Logout</span>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    className={classNames(styles.profileBox, { [styles.active]: isDropdownOpen })}
                    onClick={toggleDropdown}
                >
                    <div className={styles.profileContainer}>
                        <div className={styles.profile}>
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <UserIcon />
                            )}
                        </div>
                        <div className={styles.profileTooltip}>
                            Profile {completionPercentage || 0}% Complete
                        </div>
                    </div>
                    <div className={styles.textgrid}>
                        <div className={styles.nameWrapper}>
                            <span title={user}>
                                {user}
                            </span>
                            <div className={classNames(styles.arrow, { [styles.open]: isDropdownOpen })}>
                                <UpIcon />
                            </div>
                        </div>
                        <div className={styles.statusContainer}>
                            <div className={styles.statusBar}>
                                <div
                                    className={styles.progress}
                                    style={{ width: `${completionPercentage || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
