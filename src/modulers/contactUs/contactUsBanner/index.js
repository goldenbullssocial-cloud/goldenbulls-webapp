'use client'
import React, { useState } from 'react'
import styles from './contactUsBanner.module.scss';
const BullImage = '/assets/images/contact-bull.png'
const BullImageMobile = '/assets/images/contact-bull-mobile.png'
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
export default function ContactUsBanner() {
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
                                Let’s Take Your Trading <span> Knowledge </span> Further
                            </motion.h1>

                            <motion.p variants={itemVariants}>
                                Have questions about our courses, learning path, or
                                where to begin? Our team is here to guide you every step of the way.
                            </motion.p>

                            <motion.div
                                className={styles.buttonAlignment}
                                variants={itemVariants}
                            >
                                <Button text="Talk to our team" className={styles.fillbutton} />
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
