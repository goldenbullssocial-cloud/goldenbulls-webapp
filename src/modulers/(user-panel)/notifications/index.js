import React from 'react'
import styles from './notifications.module.scss';
const CheckIcon = '/assets/icons/check.svg';
export default function Notifications() {
    return (
        <div className={styles.notifications}>
            <div className={styles.title}>
                <h2>
                    Notifications
                </h2>
            </div>
            <div className={styles.allBoxAlignment}>
                {
                    [...Array(6)].map(() => {
                        return (
                            <div className={styles.box}>
                                <div className={styles.boxHeader}>
                                    <div className={styles.leftAlignment}>
                                        <img src={CheckIcon} alt='CheckIcon' />
                                        <h4>
                                            Payment Successful for Forex Trading Course
                                        </h4>
                                    </div>
                                    <span>
                                        19 Minutes Ago
                                    </span>
                                </div>
                                <p>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                                    has been the industry's standard dummy text ever since the 1500s,
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
