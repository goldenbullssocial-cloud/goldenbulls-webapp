'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './heroCard.module.scss'
import CountUp from 'react-countup';
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2, // one by one
        },
    },
}

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
}

export default function HeroCard() {
    return (
        <div className={styles.heroCardAlignment}>
            <div className="container-md">
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div

                        className={styles.griditems}
                        variants={cardVariants}
                    >
                        <h3>
                            <CountUp end={5000} enableScrollSpy /> +
                            <p>
                                Active Learners
                            </p>
                        </h3>
                    </motion.div>
                    <motion.div

                        className={styles.griditems}
                        variants={cardVariants}
                    >
                        <h3>
                            <CountUp end={98} enableScrollSpy /> %
                        </h3>
                        <p>Course Rating</p>
                    </motion.div>
                    <motion.div

                        className={styles.griditems}
                        variants={cardVariants}
                    >
                        <h3>
                            <CountUp end={10000} enableScrollSpy /> +
                        </h3>
                        <p>Chart Analysis Shared</p>
                    </motion.div>
                    <motion.div

                        className={styles.griditems}
                        variants={cardVariants}
                    >
                        <h3>
                            <CountUp end={300} enableScrollSpy /> +
                        </h3>
                        <p>
                            Downloadable Resources
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
