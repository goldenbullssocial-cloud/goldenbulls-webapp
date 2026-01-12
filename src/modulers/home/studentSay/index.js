import React from 'react'
import styles from './studentSay.module.scss';
const QuoteIcon = '/assets/icons/quote.svg';
import Marquee from "react-fast-marquee";
import { studentReviewData } from '@/constants';

export default function StudentSay() {
    return (
        <div className={styles.studentSay}>
            <div className='container-md'>
                <div className={styles.title}>
                    <h2>
                        What our students say
                    </h2>
                </div>
            </div>
            <div className={styles.spacingBottom}>
                <Marquee speed={50}>
                    {
                        studentReviewData.map((student) => {
                            return (
                                <div key={student.id} className={styles.box}>
                                    <h3>
                                        {student.review}
                                    </h3>
                                    <div className={styles.profile}>
                                        <img src={student.avatar} alt={student.name} />
                                        <div>
                                            <p>
                                                {student.name}
                                            </p>
                                            <span>
                                                {student.location}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.bottomIcon}>
                                        <img src={QuoteIcon} alt='QuoteIcon' />
                                    </div>
                                </div>
                            )
                        })
                    }
                </Marquee>
            </div>
            <Marquee speed={50} direction='right'>
                {
                    studentReviewData.map((student) => {
                        return (
                            <div key={student.id} className={styles.box}>
                                <h3>
                                    {student.review}
                                </h3>
                                <div className={styles.profile}>
                                    <img src={student.avatar} alt={student.name} />
                                    <div>
                                        <p>
                                            {student.name}
                                        </p>
                                        <span>
                                            {student.location}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.bottomIcon}>
                                    <img src={QuoteIcon} alt='QuoteIcon' />
                                </div>
                            </div>
                        )
                    })
                }
            </Marquee>
        </div>
    )
}
