'use client'
import React from 'react';
import { motion } from 'framer-motion';
import styles from './telegramCommunity.module.scss';

const TelegramCommunityImage = '/assets/images/telegram-community.png';

const container = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 30,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

const imageAnim = {
    hidden: {
        opacity: 0,
        x: 40,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: 'easeOut',
        },
    },
};

export default function TelegramCommunity() {
    return (
        <motion.div
            className={styles.telegramCommunity}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="container-md">
                <motion.div className={styles.grid} variants={container}>

                    {/* Left Content */}
                    <motion.div className={styles.griditems} variants={fadeUp}>
                        <motion.h2 variants={fadeUp}>
                            What You Get:
                        </motion.h2>

                        <ol>
                            {[
                                'Beginners looking for real market exposure',
                                'Intermediate traders seeking structured insights',
                                'Learners who value discipline and consistency',
                                'Traders who want educational discussions, not noise',
                                'Anyone serious about improving trading skills',
                            ].map((item, index) => (
                                <motion.li key={index} variants={fadeUp}>
                                    {item}
                                </motion.li>
                            ))}
                        </ol>

                        <div className={styles.spacing}></div>

                        <motion.h2 variants={fadeUp}>
                            Why Join Our Private Telegram Community?
                        </motion.h2>

                        <ol>
                            {[
                                'Focused, learning-driven environment',
                                'No hype or unrealistic claims',
                                'Clear educational intent',
                                'Professional trading mindset',
                                'Supportive trading community',
                            ].map((item, index) => (
                                <motion.li key={index} variants={fadeUp}>
                                    {item}
                                </motion.li>
                            ))}
                        </ol>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div className={styles.griditems} variants={imageAnim}>
                        <div className={styles.image}>
                            <img
                                src={TelegramCommunityImage}
                                alt="Telegram Community"
                            />
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </motion.div>
    );
}
