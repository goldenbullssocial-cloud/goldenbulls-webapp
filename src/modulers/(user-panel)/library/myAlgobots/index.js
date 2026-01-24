"use client";
import React, { useEffect, useState } from 'react'
import styles from './myAlgobots.module.scss';
import { purchasedAllCourses } from '@/services/dashboard';

export default function MyAlgobots() {
    const [courses, setCourses] = useState([]);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        const fetchCourses = async () => {
          try {
            setLoading(true);
            const res = await purchasedAllCourses({ type: 'BOTS', page: 1, limit: 10 });
            if (res && res.payload) {
              setCourses(res.payload.BOTS || []);
            }
          } catch (error) {
            console.error("Error fetching my courses:", error);
          } finally {
            setLoading(false);
          }
        };
        fetchCourses();
      }, []);
    
    return (
        <div className={styles.myAlgobots}>
            <div className={styles.title}>
                <h2>
                    My Algobots
                </h2>
            </div>
            <div className={styles.grid}>
                {
                    [...Array(5)].map(() => {
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
                                    <div className={styles.progress}>
                                        <div className={styles.active}></div>
                                    </div>
                                    <div className={styles.bottomText}>
                                        <span>14% Completed</span>
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
