"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './sidebar.module.scss';
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
import { getCookie } from '../../../cookie';
import Link from 'next/link';

export default function Sidebar() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const user = getCookie('user');
        const userName = (user && JSON.parse(user)?.name);
        setUser(userName);
    }, []);

    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <aside className={styles.sidebar}>
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
                    <NotificationsIcon />
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
            <div className={styles.asideFooter}>
                <div className={styles.profileBox}>
                    <div className={styles.profile}>
                        <UserIcon />
                    </div>
                    <div className={styles.textgrid}>
                        <span>
                            {user}
                        </span>
                        <UpIcon />
                    </div>
                </div>
            </div>
        </aside>
    )
}
