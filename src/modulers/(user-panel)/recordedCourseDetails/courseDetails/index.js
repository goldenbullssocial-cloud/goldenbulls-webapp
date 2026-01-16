"use client";
import React, { useEffect, useState } from 'react'
import styles from './courseDetails.module.scss';
import Button from '@/components/button';
import ClockIcon from '@/icons/clockIcon';
import StarIcon from '@/icons/starIcon';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCourseById, getPaymentUrl } from '@/services/dashboard';

const CourseImageDefault = '/assets/images/course-lg.png';

export default function CourseDetails() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const res = await getCourseById({ id });
                if (res?.payload?.data) {
                    setCourse(res?.payload?.data);
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
        // toast.error(
        //   "A payment session is already active and will expire in 10 minutes. Please complete the current payment or try again after it expires."
        // );
        router.replace(response?.payload?.data?.checkout_url);
      } else {
        router.replace(response?.payload?.data?.checkout_url);
      }
    } catch (error) {
      console.error("Payment error:", error);
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
                        <div
                            className={styles.leftBottomAlignment}
                        >
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
                                <Button text="Enroll Now" onClick={handlePayment} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
