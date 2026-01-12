'use client'
import React from 'react';
import { motion } from 'framer-motion';
import styles from './transparentPricing.module.scss';
import Button from '@/components/button';

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

const cardAnim = {
    hidden: {
        opacity: 0,
        y: 40,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

export default function TransparentPricing() {
    return (
        <motion.div
            className={styles.transparentPricing}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="container-md">

                {/* Title */}
                <motion.div className={styles.title} variants={fadeUp}>
                    <h2>Transparent Pricing</h2>
                </motion.div>

                {/* Pricing Grid */}
                <motion.div className={styles.grid} variants={container}>
                    {[...Array(4)].map((_, index) => (
                        <motion.div
                            key={index}
                            className={styles.griditems}
                            variants={cardAnim}
                            whileHover={{
                                y: -6,
                                transition: { duration: 0.2 },
                            }}
                        >
                            <div className={styles.cardHeader}>
                                <h2>
                                    <span className={styles.lgText}>$10</span>{' '}
                                    <span className={styles.smallText}>/ Month</span>
                                </h2>
                            </div>

                            <Button
                                text="Subscribe Now"
                                className={styles.buttonWidth}
                            />
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </motion.div>
    );
}
