"use client";
import React from 'react'
import styles from './commonCourses.module.scss';
import StarIcon from '@/icons/starIcon';
import ClockInIcon from '@/icons/clockInIcon';
import CoursesIcon from '@/icons/coursesIcon';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
import NoData from '@/components/noData';
const CardImage = '/assets/images/course-user.png';
const ClockIcon = "/assets/icons/calender-icon.png";
export default function CommonCourses({ title, courses, loading }) {
    const router = useRouter();
    return (
        <div className={styles.commonCourses}>
            <div className={styles.title}>
                <h2>
                    {title}
                </h2>
            </div>
            <div className={styles.grid}>
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div className={styles.griditems}>
                            <div className={`${styles.cardImage} ${styles.skeleton} ${styles.skeletonImage}`} />

                            <div className={styles.details}>
                                <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />

                                <div className={styles.secContent}>
                                    <div
                                        className={`${styles.skeleton} ${styles.skeletonText}`}
                                        style={{ width: "40%" }}
                                    />
                                    <div
                                        className={`${styles.skeleton} ${styles.skeletonText}`}
                                        style={{ width: "50%" }}
                                    />
                                </div>

                                <div className={styles.listAlignment}>
                                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%" }} />
                                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%" }} />
                                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%" }} />
                                </div>

                                <div className={styles.buttonDesign}>
                                    <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
                                </div>
                            </div>
                        </div>
                    ))
                ) : courses && courses.length > 0 ? (
                    courses?.map((course, i) => {
                        return (
                            <div className={styles.griditems} key={i}>
                                <div className={styles.cardImage}>
                                    <img src={course?.courseVideo} alt='CardImage' />
                                </div>
                                <div className={styles.details}>
                                    <h3>
                                        {course?.CourseName}
                                    </h3>
                                    <div className={styles.secContent}>
                                        <h4>
                                            ${course?.price}
                                        </h4>
                                        <ul>
                                            <li>{course?.instructor?.name}</li>
                                        </ul>
                                    </div>
                                    <div className={styles.listAlignment}>
                                        <div className={styles.time}>
                                            <ClockInIcon />
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
                                    </div>
                                    <div className={styles.buttonDesign}>
                                        <Button text="Enroll Now" onClick={() => { router.push(`/recorded-course-details?id=${course?._id}&type=${course?.courseType}`) }} />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <NoData
                        icon={<CoursesIcon />}
                        title="No courses found"
                        description="There are no courses currently available in this category."
                    />
                )}
            </div>
        </div>
    )
}
