'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './coursesDetailsBanner.module.scss';
import Button from '@/components/button';
import ClockIcon from '@/icons/clockIcon';
import StarIcon from '@/icons/starIcon';
import { getCourseById } from '@/services/dashboard';

const CourseImage = '/assets/images/course-xs.png';

/* =======================
   Framer Motion Variants
======================= */

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
        y: 40,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.8, 0.25, 1],
        },
    },
};

const cardAnim = {
    hidden: {
        opacity: 0,
        y: 60,
        scale: 0.95,
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function CoursesDetailsBanner() {
    const params = useParams();
    const [courseData, setCourseData] = useState([]);
    console.log(params, "=====params");

    useEffect(() => {
        const fetchCourse = async () => {
            if (params?.id) {
                try {
                    const response = await getCourseById({ id: params.id });

                    if (response?.success) {
                        setCourseData(response?.payload?.data);
                    }
                } catch (error) {
                    console.error("Error fetching course details:", error);
                }
            }
        };
        fetchCourse();
    }, [params?.id]);

    console.log(courseData, "-----courseData");


    return (
        <motion.div
            className={styles.coursesDetailsBanner}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className={styles.box}>
                <div className="container-md">
                    <div className={styles.grid}>

                        {/* LEFT CONTENT */}
                        <motion.div
                            className={styles.griditems}
                            variants={container}
                        >
                            <motion.h1 variants={fadeUp}>
                                <span> Advanced </span> forex trading Masterclass
                            </motion.h1>

                            <motion.p variants={fadeUp}>
                                Forex trading is one of the most dynamic and widely followed financial markets in the world, and learning how it works can open the door to powerful financial knowledge and disciplined decision-making. Our forex trading course is designed to help learners build a strong foundation in currency markets, understand how global economic events influence price movements, and develop a structured approach to market analysis.
                            </motion.p>

                            <motion.div
                                className={styles.leftBottomAlignment}
                                variants={fadeUp}
                            >
                                <div className={styles.time}>
                                    <ClockIcon />
                                    <span>12 Hours</span>
                                </div>

                                <div className={styles.dotButton}>
                                    <div className={styles.dot}></div>
                                    <button>
                                        <span>Beginner</span>
                                    </button>
                                </div>

                                <div className={styles.ratingAlignment}>
                                    <div className={styles.dot}></div>
                                    <div className={styles.rating}>
                                        <StarIcon />
                                        <span>4.5</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* RIGHT CARD */}
                        <motion.div
                            className={styles.griditems}
                            variants={cardAnim}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.card}>
                                <div className={styles.cardImage}>
                                    <div className={styles.image}>
                                        <img src={CourseImage} alt="CourseImage" />
                                    </div>
                                </div>

                                <div className={styles.details}>
                                    <div className={styles.contentAlignment}>
                                        <h3>$129</h3>
                                        <ul>
                                            <li>Johnathan Doe</li>
                                        </ul>
                                    </div>

                                    <Button
                                        text="Enroll Now"
                                        className={styles.buttonWidth}
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
}
