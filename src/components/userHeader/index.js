"use client";
import React, { useEffect, useState } from 'react'
import styles from './userHeader.module.scss';
import Button from '../button';
import { getCookie } from '../../../cookie';
import { usePathname } from 'next/navigation';
import { getProfile } from '@/services/dashboard';

export default function UserHeader({ searchValue = '', onSearchChange, onSearch }) {
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    const showSearchBar = pathname !== '/profile';

    useEffect(() => {
        const fetchProfile = async () => {
            const userCookie = getCookie('user');
            if (userCookie) {
                try {
                    const parsedUser = JSON.parse(userCookie);
                    if (parsedUser._id) {
                        const response = await getProfile(parsedUser._id);
                        if (response.success) {
                            const data = response.payload.data[0];
                            const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
                            setUser(fullName || parsedUser.firstName || 'User');
                        } else {
                            setUser(parsedUser.firstName || 'User');
                        }
                    }
                } catch (error) {
                    console.error('Error fetching or parsing profile:', error);
                }
            }
        };

        fetchProfile();
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
