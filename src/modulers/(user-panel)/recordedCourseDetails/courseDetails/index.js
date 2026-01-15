"use client";
import React, { useEffect, useState } from 'react'
import styles from './courseDetails.module.scss';
import Button from '@/components/button';
import ClockIcon from '@/icons/clockIcon';
import StarIcon from '@/icons/starIcon';
import { useSearchParams } from 'next/navigation';
import { getCourseById } from '@/services/dashboard';

const CourseImageDefault = '/assets/images/course-lg.png';

export default function CourseDetails() {
    const searchParams = useSearchParams();
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
                                <Button text="Enroll Now" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
