'use client'
import React from 'react';
import { motion } from 'framer-motion';
import styles from './whoWeAre.module.scss';

const container = {
    hidden: {},
    show: {
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
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

export default function WhoWeAre() {
    return (
        <motion.div
            className={styles.whoWeAreAlignment}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
        >
            <div className="container-md">
                <div className={styles.grid}>

                    <motion.div className={styles.griditems} variants={fadeUp}>
                        <div className={styles.text}>
                            <h2>who we are</h2>
                            <p>
                                We are a team of passionate market educators committed to simplifying the world of trading and investing through structured, easy-to-understand education.
                            </p>
                            <p>
                                At our core, we believe that successful trading starts with strong foundations, discipline, and the right mindset.
                            </p>
                        </div>
                    </motion.div>

                    {/* Empty grid item stays untouched */}
                    <div className={styles.griditems}></div>

                    <motion.div className={styles.griditems} variants={container}>
                        <motion.div className={styles.box} variants={fadeUp}>
                            <h3>our mission</h3>
                            <p>
                                Our mission is to make financial and trading education simple, practical, and accessible for everyone.
                            </p>
                        </motion.div>

                        <motion.div className={styles.box} variants={fadeUp}>
                            <h3>our vision</h3>
                            <p>
                                Our vision is to become a trusted global platform for trading education by empowering individuals.
                            </p>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
}
