'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './joinChannel.module.scss'
import Button from '@/components/button'
import Link from 'next/link'

const VecImage = '/assets/images/vec-yellow.png'
const TelegramImage = '/assets/images/telegram.png'

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

const imageEnter = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
}

/* Infinite subtle motion */
const floatingVec = {
    x: [0, 0, 0],
    transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
    },
}

const telegramPulse = {
    scale: [1, 1.05, 1],
    opacity: [1, 0.7, 1],
    transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
    },
}

export default function JoinChannel() {
    return (
        <div className={styles.joinChannel}>
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
                            Join Our Telegram Community
                        </motion.h2>

                        <motion.p variants={textItem}>
                            Join our Telegram community to stay updated, ask questions, and connect with fellow learners. Get quick tips, important announcements, and valuable insights all in one place. Be part of a growing network focused on learning and financial growth.
                        </motion.p>

                        <motion.p variants={textItem}>
                            Engage in real time discussions and get support whenever you need it. Grow faster by learning alongside an active and motivated community.
                        </motion.p>

                        <motion.div
                            variants={textItem}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href="/telegram-channel">
                                <Button
                                    text="Join Our Community"
                                    className={styles.buttonAlignment}
                                />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT VISUAL */}
                    <motion.div
                        className={styles.griditems}
                        variants={imageEnter}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Background Vector */}
                        <motion.div
                            className={styles.image}
                            animate={floatingVec}
                        >
                            <img src={VecImage} alt="VecImage" />
                        </motion.div>

                        {/* Telegram Icon */}
                        <div className={styles.iconAlign}>
                            <motion.div
                                className={styles.iconCenter}
                                animate={telegramPulse}
                            >
                                <img src={TelegramImage} alt="TelegramImage" />
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
