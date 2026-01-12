"use client";
import React, { useEffect, useState } from 'react'
import styles from './userHeader.module.scss';
import Button from '../button';
import { getCookie } from '../../../cookie';
export default function UserHeader() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const user = getCookie('user');
        const userName = (user && JSON.parse(user)?.name);
        setUser(userName);
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
            <div className={styles.rightContent}>
                <input type='text' placeholder='Search Courses and Algobots' />
                <Button text="Search" />
            </div>
        </div>
    )
}
