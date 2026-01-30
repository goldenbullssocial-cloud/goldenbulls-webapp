"use client";
import React, { useEffect, useState } from 'react'
import styles from './userHeader.module.scss';
import Button from '../button';
import { getCookie } from '../../../cookie';
import { usePathname } from 'next/navigation';

export default function UserHeader({ searchValue = '', onSearchChange, onSearch }) {
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    // Hide search bar on profile page
    const showSearchBar = pathname !== '/profile';

    useEffect(() => {
        const user = getCookie('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                const userName = `${parsedUser.firstName} ${parsedUser.lastName}`;
                setUser(userName);
            } catch (error) {
                console.error('Error parsing user cookie:', error);
            }
        }
    }, []);

    return (
        <div className={styles.userHeader}>
            <div className={styles.leftContent}>
                <div className={styles.line}></div>
                <div>
                    <h2>
                        Hello <span>{user}</span>
                    </h2>
                    <p>
                        Keep learning, and grow your understanding of trading step by step.
                    </p>
                </div>
            </div>
            {showSearchBar && (
                <div className={styles.rightContent}>
                    <input
                        type='text'
                        placeholder='Search Courses and Algobots'
                        value={searchValue}
                        onChange={onSearchChange}
                    />
                    <Button text="Search" onClick={onSearch} />
                </div>
            )}
        </div>
    )
}
