import React from 'react'
import styles from './courseDetails.module.scss';
import Button from '@/components/button';
import ClockIcon from '@/icons/clockIcon';
import StarIcon from '@/icons/starIcon';
const CourseImage = '/assets/images/course-lg.png';
export default function CourseDetails() {
    return (
        <div className={styles.courseDetails}>
            <div className={styles.grid}>
                <div className={styles.griditems}>
                    <div className={styles.contnetStyle}>
                        <div className={styles.subtitle}>
                            <span>
                                Recorded Course
                            </span>
                            <h3>
                                Advanced forex trading Masterclass
                            </h3>
                            <p>
                                Forex trading is one of the most dynamic and widely followed financial markets in the world, and learning how it works can open the door to powerful financial knowledge and disciplined  decision making. Our forex trading course is designed to help learners build a strong foundation in currency markets, understand how global economic events influence
                                price movements, and develop a structured approach to market analysis.
                            </p>
                        </div>
                        <div
                            className={styles.leftBottomAlignment}
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
                            
                        </div>
                    </div>
                </div>
                <div className={styles.griditems}>
                    <div className={styles.card}>
                        <div className={styles.image}>
                            <img src={CourseImage} alt='CourseImage' />
                        </div>
                        <div className={styles.details}>
                            <div className={styles.twoText}>
                                <h4>
                                    $129
                                </h4>
                                <ul>
                                    <li>
                                        Johnathan Doe
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
