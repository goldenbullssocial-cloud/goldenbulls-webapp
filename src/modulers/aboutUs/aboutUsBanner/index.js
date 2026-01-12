'use client'
import React, { useState } from 'react'
import styles from './aboutUsBanner.module.scss';
const BullImage = '/assets/images/about-banner.png'
const BullImageMobile = '/assets/images/bull-mobile-about.png'
import Button from '@/components/button'
import { motion } from 'framer-motion'
import DownloadApp from '@/components/downloadApp'

/* Left Content Animation */
const textVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
            staggerChildren: 0.15,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
}

/* Right Image Infinite Animation */
const bullVariants = {
    animate: {
        rotateY: [0, 10, 0, -10, 0],
        rotateX: [0, 3, 0, -3, 0],
        // scale: [1, 1.02, 1],
        transition: {
            duration: 6,
            ease: 'easeInOut',
            repeat: Infinity,
        },
    },
}
export default function AboutUsBanner() {
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    return (
        <div className={styles.aboutUsBanner}>
            <div className="container-md">
                <div className={styles.grid}>

                    {/* LEFT CONTENT */}
                    <div className={styles.griditems}>
                        <motion.div
                            className={styles.text}
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.h1 variants={itemVariants}>
                                Empowering Traders Through <span> Practical </span> Education
                            </motion.h1>

                            <motion.p variants={itemVariants}>
                                We believe that trading is a skill that can be learned, practiced, and mastered over time. Our mission is to make financial education simple, structured,
                                and accessible to anyone who wants to understand the markets.
                            </motion.p>

                            <motion.div
                                className={styles.buttonAlignment}
                                variants={itemVariants}
                            >
                                <Button text="Explore Courses" className={styles.fillbutton} />
                                <button className={styles.outlineButton} onClick={() => setIsDownloadModalOpen(true)}>
                                    Download App
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className={styles.griditems}>
                        <motion.div
                            className={styles.image}
                            variants={bullVariants}
                            animate="animate"
                        >
                            <img src={BullImage} alt="BullImage" />
                            <img src={BullImageMobile} alt="BullImageMobile" />
                        </motion.div>
                    </div>

                </div>
            </div>
            <DownloadApp isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
        </div>
    )
}
