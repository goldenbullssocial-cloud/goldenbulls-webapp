'use client'
import React, { useEffect, useState } from 'react';
import styles from './reviews.module.scss';
import StarIconXs from '@/icons/starIconXs';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import { getCourseRating } from '@/services/courses';
import { useSearchParams } from 'next/navigation';

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

export default function Reviews({ smallFont }) {
    const [courseRating, setCourseRating] = useState(null);
    const id = useSearchParams().get('id');

    useEffect(() => {
        const fetchCourseRating = async () => {
            try {
                const response = await getCourseRating(id);
                if (response?.success && response?.payload) {
                    setCourseRating(response?.payload?.data);
                } else {
                    setCourseRating(response?.payload);
                }
            } catch (error) {
                console.error("Error fetching course rating:", error);
            }
        };

        if (id) {
            fetchCourseRating();
        }
    }, [id]);

    return (
        <motion.div
            className={classNames(styles.reviewsContentAlignment, smallFont ? styles.smallSize : "")}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
        >
            {/* Title */}
            <motion.div
                className={styles.titleTextAlignment}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <h2>Reviews</h2>
                <div className={styles.line}></div>
                <span>4.6 Course Rating</span>
            </motion.div>

            {/* Reviews Grid */}
            <motion.div className={styles.allBox} variants={containerVariants}>
                {[...Array(2)].map((_, index) => (
                    <motion.div
                        key={index}
                        className={styles.box}
                        variants={cardVariants}
                    >
                        <div className={styles.text}>
                            <p>
                                The course structure is very clear and easy to follow.
                                Concepts that once felt confusing now make sense.
                                It gave me a solid foundation in trading.
                            </p>
                        </div>

                        <div className={styles.boxBottomAlignment}>
                            <div className={styles.leftcontent}>
                                <div className={styles.profile}>MT</div>
                                <div>
                                    <p>Mark Twein</p>
                                    <div className={styles.ratingAlignment}>
                                        <StarIconXs />
                                        <StarIconXs />
                                        <StarIconXs />
                                        <StarIconXs />
                                        <StarIconXs />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <h4>14 November 2025</h4>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Load More */}
            <motion.div
                className={styles.loadMore}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
            >
                <button>
                    <span>Load More</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
