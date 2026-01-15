"use client";
import React from 'react'
import styles from './commonCourses.module.scss';
import StarIcon from '@/icons/starIcon';
import ClockInIcon from '@/icons/clockInIcon';
import Button from '@/components/button';
import { useRouter } from 'next/navigation';
const CardImage = '/assets/images/course-user.png';
const ClockIcon = "/assets/icons/calender-icon.png";
export default function CommonCourses({ title, courses }) {
    const router = useRouter();
    return (
        <div className={styles.commonCourses}>
            <div className={styles.title}>
                <h2>
                    {title}
                </h2>
            </div>
            <div className={styles.grid}>
                {
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
                                        <Button text="Enroll Now" onClick={() => {router.push(`/recorded-course-details?id=${course?._id}&type=${course?.courseType}`) }} />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
