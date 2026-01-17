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
    const course = Array.isArray(courseData) ? courseData[0] : courseData;

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

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };    

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
                                {course?.CourseName && (
                                    <>
                                        <span>{course.CourseName.split(' ').slice(0, 2).join(' ')} </span>
                                        {course.CourseName.split(' ').slice(2).join(' ')}
                                    </>
                                )}
                            </motion.h1>

                            <motion.p variants={fadeUp}>
                                {course?.description}
                            </motion.p>

                            <motion.div
                                className={styles.leftBottomAlignment}
                                variants={fadeUp}
                            >
                                <div className={styles.time}>
                                    <ClockIcon />
                                    <span>{course?.hours} Hours</span>
                                </div>

                                <div className={styles.dotButton}>
                                    <div className={styles.dot}></div>
                                    <button>
                                        <span>{course?.courseLevel}</span>
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
                                        {course?.courseIntroVideo ? (
                                            getYoutubeId(course.courseIntroVideo) ? (
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${getYoutubeId(course.courseIntroVideo)}?autoplay=1&mute=1&loop=1&controls=1&playlist=${getYoutubeId(course.courseIntroVideo)}`}
                                                    title="Course Video"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    style={{ borderRadius: '12px', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                ></iframe>
                                            ) : (
                                                <video
                                                    src={course.courseIntroVideo}
                                                    poster={course?.courseVideo || CourseImage}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    controls
                                                    width="100%"
                                                    style={{ borderRadius: '12px', objectFit: 'cover', height: '100%' }}
                                                />
                                            )
                                        ) : (
                                            <img src={course?.courseVideo || CourseImage} alt="CourseImage" />
                                        )}
                                    </div>
                                </div>

                                <div className={styles.details}>
                                    <div className={styles.contentAlignment}>
                                        <h3>${course?.price}</h3>
                                        <ul>
                                            <li>{course?.instructor?.name}</li>
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
