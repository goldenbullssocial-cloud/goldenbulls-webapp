"use client";
import React from 'react'
import styles from './referAndEarnTab.module.scss';

export default function ReferAndEarnTab({ activeTab, setActiveTab }) {
    const tabs = ['Earning History', 'Total Withdrawal', 'Withdraw Request'];

    return (
        <div className={styles.referAndEarnTab}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={activeTab === tab ? styles.active : ''}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    )
}
