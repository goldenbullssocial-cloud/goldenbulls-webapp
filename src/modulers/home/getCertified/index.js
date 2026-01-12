'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './getCertified.module.scss'
import CheckIcon from '@/icons/checkIcon'

const Certificate = '/assets/images/certificate.png'

/* ===== Variants ===== */
const textContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
}

const textItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
}

const listItem = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
}

const imageEnter = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
}

/* Infinite animation */
const certificateFloat = {
    y: [0, 5, 0],
    rotate: [0, 1.5, 0],
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
    },
}

export default function GetCertified() {
    return (
        <div className={styles.getCertified}>
            <div className="container-md">
                <div className={styles.grid}>
                    {/* LEFT CONTENT */}
                    <motion.div
                        className={styles.griditems}
                        variants={textContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        <motion.h2 variants={textItem}>
                            get certified
                        </motion.h2>

                        <motion.p variants={textItem}>
                            Upon successful completion of our courses, receive certificates that validate your trading knowledge and skills. Our certifications are recognized in the financial industry.
                        </motion.p>

                        <motion.div
                            className={styles.allIconAlignment}
                            variants={textContainer}
                        >
                            {[
                                'Verified on LinkedIn & Professional Networks',
                                'Industry-recognized credentials',
                                'Lifetime validity',
                            ].map((text, i) => (
                                <motion.div
                                    key={i}
                                    className={styles.iconGrid}
                                    variants={listItem}
                                >
                                    <CheckIcon />
                                    <span>{text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT IMAGE */}
                    <motion.div
                        className={styles.griditems}
                        variants={imageEnter}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div
                            className={styles.image}
                            animate={certificateFloat}
                        >
                            <img src={Certificate} alt="Certificate" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
