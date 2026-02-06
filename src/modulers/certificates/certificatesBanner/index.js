'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './certificatesBanner.module.scss';
const BullImage = '/assets/images/Certificates.png'
const BullImageMobile = '/assets/images/courses-bull-mobile.png'

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
export default function CertificatesBanner() {

    return (
        <div className={styles.coursesBanner}>
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
                                Certificates Issued to Our <span>Students</span>
                            </motion.h1>

                            <motion.p variants={itemVariants}>
                                This section showcases the certificates awarded to students who have successfully completed our courses. Each certificate represents the knowledge, skills, and dedication our learners have demonstrated throughout their training, reflecting our
                                commitment to high educational and professional standards.
                            </motion.p>


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

        </div>
    )
}
