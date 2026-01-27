"use client";
import React, { useEffect, useState } from 'react'
import styles from './myAlgobots.module.scss';
import { purchasedAllCourses } from '@/services/dashboard';
import AlgobotsIcon from '@/icons/algobotsIcon';
import classNames from 'classnames';
import NoData from '@/components/noData';

export default function MyAlgobots() {
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const res = await purchasedAllCourses({ type: 'BOTS', page: 1, limit: 10 });
                if (res && res.payload) {
                    setBots(res.payload.BOTS || []);
                }
            } catch (error) {
                console.error("Error fetching my courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const calculateSubscriptionData = (purchaseDate, planType) => {
        if (!purchaseDate || !planType) return { percentage: 0, daysLeft: 0 };

        const start = new Date(purchaseDate).getTime();
        const now = new Date().getTime();

        // Parse planType to determine duration in milliseconds
        // Examples: "1 Month", "3 Months", "1 Year"
        let durationMs = 0;
        const type = planType.toLowerCase();

        if (type.includes('month')) {
            const months = parseInt(type) || 1;
            durationMs = months * 30 * 24 * 60 * 60 * 1000; // approximation
        } else if (type.includes('year')) {
            const years = parseInt(type) || 1;
            durationMs = years * 365 * 24 * 60 * 60 * 1000;
        } else if (type.includes('day')) {
            const days = parseInt(type) || 1;
            durationMs = days * 24 * 60 * 60 * 1000;
        }

        const end = start + durationMs;
        const totalDuration = end - start;

        if (totalDuration <= 0) return { percentage: 100, daysLeft: 0 };

        const elapsed = now - start;
        const remaining = end - now;

        const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        const daysLeft = Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));

        return { percentage, daysLeft };
    };

    return (
        <div className={styles.myAlgobots}>
            <div className={styles.title}>
                <h2>
                    My Algobots
                </h2>
            </div>
            <div className={styles.grid}>
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <div className={`${styles.box} ${styles.skeletonBox}`} key={index}>
                            <div className={styles.skeletonDetailsBox}>
                                <div className={`${styles.statItem} ${styles.skeletonText} ${styles.skeleton}`} style={{ width: '120px', height: '16px', marginBottom: '8px' }} />
                                <div className={`${styles.statItem} ${styles.skeletonText} ${styles.skeleton}`} style={{ width: '80px', height: '16px' }} />
                            </div>

                            <div className={styles.contentBody}>
                                <div className={styles.titleSection}>
                                    <div className={`${styles.skeletonTitle} ${styles.skeleton}`} />
                                </div>

                                <div className={styles.planSection}>
                                    <div className={`${styles.skeletonPlan} ${styles.skeleton}`} />
                                </div>

                                <div className={styles.actionBtn}>
                                    <div className={`${styles.skeletonButton} ${styles.skeleton}`} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : bots.length > 0 ? (
                    bots?.map((item, index) => {
                        const { percentage, daysLeft } = calculateSubscriptionData(
                            item?.createdAt,
                            item?.planType
                        );

                        return (
                            <div className={styles.box} key={item?._id || index}>
                                <div className={styles.detailsBox}>
                                    <h3>
                                        Returns: <span className={styles.green}>{item?.botId?.strategyId?.return}%</span> <small>({item?.botId?.strategyId?.duration} Days)</small>
                                    </h3>
                                    <h4>
                                        Risk: <span>{item?.botId?.strategyId?.risk}</span>
                                    </h4>
                                </div>
                                <div className={styles.leftRightAlignment}>
                                    <p>
                                        {item?.botId?.strategyId?.title}
                                    </p>
                                    <div className={styles.line}></div>
                                    <div className={styles.progress}>
                                        <div
                                            className={styles.active}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className={styles.bottomText}>
                                        <span>{daysLeft} days left</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <NoData
                        icon={<AlgobotsIcon />}
                        title="No algobots found"
                        description="You haven't activated any algobots yet. Check out our available strategies to automate your trades."
                    />
                )}
            </div>
        </div>
    )
}
