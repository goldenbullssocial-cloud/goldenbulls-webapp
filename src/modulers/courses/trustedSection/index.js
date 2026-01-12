'use client';
import React from 'react'
import styles from './trustedSection.module.scss';
import Marquee from 'react-fast-marquee';

const team = [
    '/assets/images/team1.png',
    '/assets/images/team2.png',
    '/assets/images/team3.png',
    '/assets/images/team4.png',
    '/assets/images/team5.png',
    '/assets/images/team6.png',
    '/assets/images/team7.png',
    '/assets/images/team8.png',
    '/assets/images/team9.png',
    '/assets/images/team10.png',
];

export default function TrustedSection() {
    return (
        <div className={styles.trustedSection}>
            <div className='container-md'>
                <div className={styles.title}>
                    <h2>
                        trusted by over  learers
                    </h2>
                    <p>
                        Over 4,000 learners have chosen our academy to build their understanding of global financial markets and trading concepts. From beginners to experienced market enthusiasts, our students come from diverse backgrounds and learning goals. Our structured courses focus on knowledge, discipline, and skill development—helping
                        learners make more informed and confident decisions in their trading journey.
                    </p>
                    <p>
                        we focus on delivering structured education, practical market knowledge, and skill-based learning designed to support long-term development. Our programs are created to simplify complex trading concepts, helping learners gain clarity, confidence, and discipline in their approach. We believe real success comes from knowledge, consistency, and patience — and our mission is to make high-quality trading education accessible to everyone who is
                        serious about learning.
                    </p>
                </div>
            </div>
            <div className={styles.sliderWrap}>
                <div className={styles.top}></div>
                <div className={styles.bottom}></div>
                <Marquee>
                    {team.map((img, i) => (
                        <div key={i} className={styles.slide}>
                            <div className={styles.card}>
                                <img src={img} alt="team" />
                            </div>
                        </div>
                    ))}
                </Marquee>

            </div>
        </div>
    )
}
