import React from 'react'
import styles from './algobots.module.scss';
import Button from '@/components/button';
export default function Algobots() {
    return (
        <div className={styles.algobotsPageAlignment}>
            <div className={styles.title}>
                <h2>
                    available algobots
                </h2>
            </div>
            <div className={styles.grid}>
                {
                    [...Array(10)].map(() => {
                        return (
                            <div className={styles.box}>
                                <div className={styles.detailsBox}>
                                    <h3>
                                        Returns: <span className={styles.green}>110%</span> <small>(28 Days)</small>
                                    </h3>
                                    <h4>
                                        Risk: <span>High</span>
                                    </h4>
                                </div>
                                <div className={styles.leftRightAlignment}>
                                    <p>
                                        Forex's maximum movement tracking and
                                        analysis algobot
                                    </p>
                                    <div className={styles.line}></div>
                                    <h6>
                                        $120/Month
                                    </h6>
                                    <div className={styles.buttonStyle}>
                                        <Button text="Subscribe Now" />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
