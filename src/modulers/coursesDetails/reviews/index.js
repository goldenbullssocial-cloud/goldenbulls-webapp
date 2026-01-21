"use client";
import React, { useEffect, useState } from "react";
import styles from "./reviews.module.scss";
import StarIconXs from "@/icons/starIconXs";
import { motion } from "framer-motion";
import classNames from "classnames";
import { getCourseRating } from "@/services/courses";
import { useSearchParams } from "next/navigation";

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
            ease: "easeOut",
        },
    },
};

export default function Reviews({ smallFont }) {
    const [courseRating, setCourseRating] = useState(null);
    const id = useSearchParams().get("id");

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

    const ratingData = Array.isArray(courseRating) ? courseRating[0] : courseRating;
    console.log(ratingData, "-----ratingData");

    const reviews = ratingData?.usersRating || [];

    return (
        <motion.div className={classNames(styles.reviewsContentAlignment, smallFont ? styles.smallSize : "")} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
            {/* Title */}
            <motion.div className={styles.titleTextAlignment} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                <h2>Reviews</h2>
                <div className={styles.line}></div>
                <span>{ratingData?.averageRating} Course Rating</span>
            </motion.div>

            {/* Reviews Grid */}
            <motion.div className={styles.allBox}>
                {reviews.map((item, index) => (
                    <div key={index} className={styles.box}>
                        <div className={styles.text}>
                            <p>{item?.review}</p>
                        </div>

                        <div className={styles.boxBottomAlignment}>
                            <div className={styles.leftcontent}>
                                <div className={styles.profile}>{item?.uid?.firstName?.slice(0, 1) + item?.uid?.lastName?.slice(0, 1)}</div>
                                <div>
                                    <p>{item?.uid?.firstName} {item?.uid?.lastName}</p>
                                    <div className={styles.ratingAlignment}>
                                        {[...Array(5)].map((_, i) => (
                                            <StarIconXs
                                                key={i}
                                                id={`star-review-${index}-${i}`}
                                                fillPercent={i < (item?.rating || 0) ? 100 : 0}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.right}>
                                <h4>{new Date(item?.createdAt).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Load More */}
            <motion.div className={styles.loadMore} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} viewport={{ once: true }}>
                <button>
                    <span>Load More</span>
                </button>
            </motion.div>
        </motion.div>
    );
}
