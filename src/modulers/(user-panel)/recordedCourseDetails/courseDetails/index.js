"use client";
import React, { useEffect, useState } from 'react'
import styles from './courseDetails.module.scss';
import Button from '@/components/button';
import ClockIcon from '@/icons/clockIcon';
import StarIcon from '@/icons/starIcon';
import classNames from 'classnames';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPaymentUrl } from '@/services/dashboard';
import toast from 'react-hot-toast';
import { getCourses, submitReview } from '@/services/courses';

const CourseImageDefault = '/assets/images/course-lg.png';

const CloseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function CourseDetails() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const [course, setCourse] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const res = await getCourses({ id });
                if (res?.payload?.data) {
                    const data = res?.payload?.data;
                    setCourse(Array.isArray(data) ? data[0] : data);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };

        fetchCourse();
    }, [id]);

    const courseData = Array.isArray(course) ? course[0] : course;

    const handlePayment = async () => {
        try {
            const paymentData = {
                success_url: window.location.href,
                cancel_url: window.location.href,
                courseId: id,
                isWalletUse: false,
                walletAmount: 0,
                actualAmount: 129,
                price: courseData?.price || 0,
            };
            const response = await getPaymentUrl(paymentData);

            if (response?.payload?.code !== "00000") {
                router.replace(response?.payload?.data?.checkout_url);
            } else {
                router.replace(response?.payload?.data?.checkout_url);
            }
        } catch (error) {
            console.error("Payment error:", error);
        }
    };

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }
        try {
            setIsReviewSubmitting(true);
            const reviewData = {
                courseId: id,
                rating: rating,
                review: reviewText
            };
            const response = await submitReview(reviewData);
            if (response.success) {
                toast.success(response.message || "Review submitted successfully!");
                setShowReviewModal(false);
                setRating(0);
                setReviewText("");
            } else {
                toast.error(response.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.message || "An error occurred while submitting the review.");
        } finally {
            setIsReviewSubmitting(false);
        }
    };

    return (
        <div className={styles.courseDetails}>
            <div className={styles.grid}>
                <div className={styles.griditems}>
                    <div className={styles.contnetStyle}>
                        <div className={styles.subtitle}>
                            <span style={{ textTransform: 'capitalize' }}>
                                {courseData?.courseType ? `${courseData?.courseType} Courses` : "Recorded Course"}
                            </span>
                            <h3>
                                {courseData?.CourseName}
                            </h3>
                            <p>
                                {courseData?.description}
                            </p>
                        </div>
                        <div className={styles.leftBottomAlignment}>
                            <div className={styles.time}>
                                <ClockIcon />
                                <span>{courseData?.hours} Hours</span>
                            </div>

                            <div className={styles.dotButton}>
                                <div className={styles.dot}></div>
                                <button>
                                    <span style={{ textTransform: 'capitalize' }}>{courseData?.courseLevel}</span>
                                </button>
                            </div>

                            <div className={styles.ratingAlignment}>
                                <div className={styles.dot}></div>
                                <div className={styles.rating}>
                                    <StarIcon />
                                    <span>4.5</span>
                                </div>
                            </div>

                            <div className={styles.ratingAlignment}>
                                {courseData?.isPayment ? (
                                    <div className={styles.time}>
                                        <span
                                            className={styles.addReviewLink}
                                            onClick={() => setShowReviewModal(true)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Add a Review
                                        </span>
                                    </div>
                                ) : (<>
                                    <div className={styles.dot}></div>
                                    <div className={styles.time}><span>{courseData?.language || "English"}</span></div></>)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.griditems}>
                    <div className={styles.card}>
                        <div className={styles.image}>
                            <img src={courseData?.courseVideo || CourseImageDefault} alt='CourseImage' />
                        </div>
                        <div className={styles.details}>
                            <div className={styles.twoText}>
                                <h4>
                                    ${courseData?.price}
                                </h4>
                                <ul>
                                    <li>
                                        {courseData?.instructor?.name}
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.button}>
                                <Button text={`${courseData?.isPayment ? "Resume Now" : "Enroll Now"}`} onClick={handlePayment} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showReviewModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>

                            <h2>Add Review</h2>
                            <button className={styles.closeBtn} onClick={() => setShowReviewModal(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.starRating}>
                                {[1, 2, 3, 4, 5].map((idx) => {
                                    // Calculate fill percent for this star
                                    let fill = 0;
                                    if (rating >= idx) {
                                        fill = 100;
                                    } else if (rating > idx - 1) {
                                        fill = 50;
                                    }

                                    return (
                                        <div key={idx} className={styles.star}>
                                            <div
                                                className={styles.halfStarLeft}
                                                onClick={() => setRating(idx - 0.5)}
                                            />
                                            <div
                                                className={styles.halfStarRight}
                                                onClick={() => setRating(idx)}
                                            />
                                            <StarIcon fillPercent={fill} id={`star_${idx}`} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={styles.reviewInput}>
                                <textarea
                                    placeholder="Write a Review"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                            </div>
                            <div className={styles.submitSection}>
                                <Button
                                    text={isReviewSubmitting ? "Submitting..." : "Submit Review"}
                                    onClick={handleReviewSubmit}
                                    disabled={rating === 0 || isReviewSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
