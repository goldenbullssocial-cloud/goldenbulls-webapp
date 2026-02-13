"use client";
import React, { useState } from "react";
const BullImage = "/assets/images/economic-calendar-banner.png";
const BullImageMobile = "/assets/images/contact-bull-mobile.png";
import { motion } from "framer-motion";
const textVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

/* Right Image Infinite Animation */
const bullVariants = {
    animate: {
        rotateY: [0, 10, 0, -10, 0],
        rotateX: [0, 3, 0, -3, 0],
        // scale: [1, 1.02, 1],
        transition: {
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
        },
    },
};
import styles from './calculatorBanner.module.scss';
export default function CalculatorBanner() {
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

    const scrollToGetInTouch = () => {
        const element = document.getElementById("get-in-touch");
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };
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
                                FOREX <span> TOOLS </span>
                                <br />
                                & ANALYSIS CENTER
                            </motion.h1>

                            <motion.p variants={itemVariants}>
                                Explore professional-grade forex tools built to support smarter trading. From economic calendars and lot size calculators to risk management tools and market analyzers, everything you need to plan, execute, and optimize your trades is in one place.
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
