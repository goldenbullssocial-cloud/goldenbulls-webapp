"use client";
import React, { useState } from 'react'
import styles from './referAndEarn.module.scss';
import CardView from './cardView';
import ReferAndEarnTab from './referAndEarnTab';
import EarningHistory from './earningHistory';
import WithdrawRequest from './withdrawRequest';

export default function ReferAndEarn() {
    const [activeTab, setActiveTab] = useState('Earning History');

    return (
        <div className={styles.referAndEarn}>
            <div className={styles.title}>
                <h2>
                    refer and earn
                </h2>
            </div>
            <CardView />
            <ReferAndEarnTab activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'Withdraw Request' ? (
                <WithdrawRequest />
            ) : (
                <EarningHistory activeTab={activeTab} />
            )}
        </div>
    )
}
