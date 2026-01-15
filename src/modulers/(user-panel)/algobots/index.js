"use client";
import React, { useEffect, useState } from 'react'
import styles from './algobots.module.scss';
import Button from '@/components/button';
import { getBots } from '@/services/dashboard';

export default function Algobots() {
    const [bots, setBots] = useState([]);

    useEffect(() => {
        const fetchBots = async () => {
            try {
                const res = await getBots();
                if (res?.payload) {
                    setBots(res?.payload?.data);
                } else if (Array.isArray(res)) {
                    setBots(res);
                }
            } catch (error) {
                console.error("Error fetching bots:", error);
            }
        };

        fetchBots();
    }, []);

    return (
        <div className={styles.algobotsPageAlignment}>
            <div className={styles.title}>
                <h2>
                    available algobots
                </h2>
            </div>
            <div className={styles.grid}>
                {
                    bots?.map((bot, index) => {
                        return (
                            <BotCard bot={bot} key={index} />
                        )
                    })
                }
            </div>
        </div>
    )
}

const BotCard = ({ bot }) => {
    const [open, setOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(bot?.strategyPlan?.[0] || {});

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
                    {bot?.title}
                </p>
                <div className={styles.line}></div>
                <div className={styles.dropdownContainer} onClick={() => setOpen(!open)}>
                    <span>${selectedPlan?.initialPrice}/{selectedPlan?.planType}</span>
                    <div className={styles.imgIcon}>
                        <img src="/assets/icons/vector.svg" alt="icon" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                    </div>
                    {open && (
                        <div className={styles.dropdownList}>
                            {bot?.strategyPlan?.map((plan, i) => (
                                <div
                                    key={i}
                                    className={styles.dropdownItem}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPlan(plan);
                                        setOpen(false);
                                    }}
                                >
                                    {plan?.initialPrice}$/{plan?.planType}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.buttonStyle}>
                    <Button text="Subscribe Now" />
                </div>
            </div>
        </div>
    )
}
