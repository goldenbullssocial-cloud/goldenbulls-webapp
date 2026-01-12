import React from 'react'
import styles from './referAndEarnTab.module.scss';
export default function ReferAndEarnTab() {
    return (
        <div className={styles.referAndEarnTab}>
            <button className={styles.active}>
                Earning History
            </button>
            <button>
                Total Withdrawal
            </button>
            <button>
                Withdraw Request
            </button>
        </div>
    )
}
