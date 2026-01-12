'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './meetTheFounder.module.scss'

const FounderImage = '/assets/images/founder.png'
const LineImage = '/assets/images/line-fill-vec.png'
const LinkdinIcon = '/assets/icons/linkdin-fill.svg'
const YoutubeIcon = '/assets/icons/youtube-fill.svg'
const InstagramIcon = '/assets/icons/instagram-fill.svg'
const FacebookIcon = '/assets/icons/facebook-fill.svg'
const FacebookIconFill = '/assets/icons/fill-youtube.svg'

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
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
}

const floatingAnimation = {
    y: [0, -15, 0],
    rotate: [0, 1.5, 0],
    transition: {
        duration: 4,
        ease: 'easeInOut',
    },
}

export default function MeetTheFounder() {
    return (
        <div className={styles.meetTheFounder}>

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
                            Meet the Founder
                        </motion.h2>

                        <motion.h3 variants={textItem}>
                            Mr. Amol Bhojgude — Founder & CEO
                        </motion.h3>

                        <motion.p variants={textItem}>
                            Amol Bhojgude, the Founder and CEO of Golden Bulls, built the academy with a clear mission—to simplify trading education and make high quality learning accessible to everyone. With a passion for financial literacy and 8 years of personal experience studying the markets, Amol created a
                            learning environment focused on clarity, structure, and real world application.
                        </motion.p>

                        <motion.p variants={textItem}>
                            His leadership is driven by a commitment to empower learners with knowledge, discipline, and confidence, helping them develop the skills
                            needed to navigate today’s financial markets with purpose and understanding.
                        </motion.p>

                        {/* SOCIAL ICONS */}
                        <motion.div
                            className={styles.socialIcon}
                            variants={textContainer}
                        >
                            {[LinkdinIcon, YoutubeIcon, InstagramIcon, FacebookIcon].map(
                                (icon, i) => (
                                    <motion.img
                                        key={i}
                                        src={icon}
                                        alt="social"
                                        variants={textItem}
                                        whileHover={{ scale: 1.2 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    />
                                )
                            )}
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
                            animate={floatingAnimation}
                        >
                            <img src={FounderImage} alt="Founder" />
                        </motion.div>

                        <motion.div
                            className={styles.button}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button>
                                My Story
                                <img src={FacebookIconFill} alt="icon" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
