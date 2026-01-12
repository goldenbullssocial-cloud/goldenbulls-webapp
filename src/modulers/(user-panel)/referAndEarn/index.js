import React from 'react'
import styles from './referAndEarn.module.scss';
import CardView from './cardView';
import ReferAndEarnTab from './referAndEarnTab';
import EarningHistory from './earningHistory';
export default function ReferAndEarn() {
    return (
        <div className={styles.referAndEarn}>
            <div className={styles.title}>
                <h2>
                    refer and earn
                </h2>
            </div>
            <CardView />
            <ReferAndEarnTab />
            <EarningHistory />
        </div>
    )
}
