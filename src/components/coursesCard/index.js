'use client'
import React from 'react'
import { motion } from 'framer-motion'

import { useRouter } from 'next/navigation';
import styles from './coursesCard.module.scss';
import Button from '../button';
import StarIcon from '@/icons/starIcon';
//import ClockIcon from '@/icons/clockIcon';
const CourseImage = '/assets/images/course.png'
const ClockIcon = "/assets/icons/calender-icon.png";
const Location = "/assets/icons/location-icon.png";

export default function CoursesCard({ title, price, author, duration, level, rating, image, location, btnLink }) {
    const router = useRouter();
    return (
        <motion.div
            className={styles.courseCard}


            onMouseMove={(e) => {
                const card = e.currentTarget;
                const image = card.querySelector(`.${styles.image}`);
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPos = x / rect.width;
                const yPos = y / rect.height;
                const rotateY = (xPos - 0.5) * 20;
                const rotateX = (0.5 - yPos) * 20;

                // Card tilt
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';

                // Image parallax movement
                if (image) {
                    const translateX = (xPos - 0.5) * 20; // adjust strength
                    const translateY = (yPos - 0.5) * 20;
                    image.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
                }
            }}
            onMouseLeave={(e) => {
                const card = e.currentTarget;
                const image = card.querySelector(`.${styles.image}`);

                // Reset card
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                card.style.boxShadow = 'none';

                // Reset image
                if (image) {
                    image.style.transform = 'translate(0px, 0px) scale(1)';
                }
            }}
        >
            <div className={styles.image}>
                <img src={image} alt={title} />
            </div>

            <div className={styles.details}>
                <h3>
                    {title}
                </h3>

                <div className={styles.secContent}>
                    <h4>${price}</h4>
                    <ul>
                        <li>{author}</li>
                    </ul>
                </div>

                <div className={styles.listAlignment}>
                    <div className={styles.time}>
                        {location ? (
                            <>
                                <img src={Location} alt="location icon" />
                                <span>{location}</span>
                            </>
                        ) : (
                            <>
                                <img src={ClockIcon} alt="clock icon" />
                                <span>{duration} Hours</span>
                            </>
                        )}
                    </div>

                    <div className={styles.dotButton}>
                        <div className={styles.dot}></div>
                        <button>
                            <span>{level}</span>
                        </button>
                    </div>

                    <div className={styles.ratingAlignment}>
                        <div className={styles.dot}></div>
                        <div className={styles.rating}>
                            <StarIcon />
                            <span>{rating}</span>
                        </div>
                    </div>
                </div>

                <Button
                    text="Enroll Now"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (btnLink) {
                            router.push(btnLink);
                        }
                    }}
                    className={styles.buttonStyle}
                />
            </div>
        </motion.div>
    )
}
