'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './herobanner.module.scss'
import Button from '@/components/button'
import Link from 'next/link'
import DownloadApp from '@/components/downloadApp'

const BullImage = '/assets/images/bull.png'
const BullImageMobile = '/assets/images/hero-banner-bull.png'
const MobileBullImage = '/assets/images/mobile-bull.png'

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


export default function Herobanner() {
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    return (
        <div className={styles.herobanner}>
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
                                one step towards <span>financial</span> Freedom
                            </motion.h1>

                            <motion.p variants={itemVariants}>
                                Discover structured courses created for learners at every stage
                                of their trading journey. Each course is designed with clarity,
                                real-world examples, and step-by-step guidance to help you
                                understand key concepts and develop practical skills.
                            </motion.p>

                            <motion.div
                                className={styles.buttonAlignment}
                                variants={itemVariants}
                            >
                                <Link href="/courses">
                                    <Button text="Explore Courses" className={styles.fillbutton} />
                                </Link>
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
