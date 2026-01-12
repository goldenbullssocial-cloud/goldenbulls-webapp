'use client'
import React, { useState } from 'react'
import styles from './courseContent.module.scss';
import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import Reviews from '@/modulers/coursesDetails/reviews';
const titleAnim = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.8, 0.25, 1],
        },
    },
};
const courseData = [
    {
        chapter: 'CHAPTER 1',
        title: 'Foundations of Trading',
        duration: '35 Min',
        content: [
            'Foundations of Trading introduces you to the essential principles that every successful trader must understand before stepping into live markets.',
            'By the end of this chapter, you’ll have a clear framework for approaching any market with structure, logic, and confidence.'
        ]
    },
    {
        chapter: 'CHAPTER 2',
        title: 'Market Structure',
        duration: '40 Min',
        content: [
            'Understand how markets move, identify trends, and read price behavior with confidence.',
            'Learn higher highs, lower lows, and structure breaks.'
        ]
    },
    {
        chapter: 'CHAPTER 3',
        title: 'Support & Resistance',
        duration: '30 Min',
        content: [
            'Master key price levels where institutions react.',
            'Learn to mark high-probability zones.'
        ]
    },
    {
        chapter: 'CHAPTER 4',
        title: 'Candlestick Psychology',
        duration: '25 Min',
        content: [
            'Decode buyer and seller intent using candle patterns.',
            'Avoid emotional trading decisions.'
        ]
    },
    {
        chapter: 'CHAPTER 5',
        title: 'Risk Management',
        duration: '45 Min',
        content: [
            'Protect capital with smart risk rules.',
            'Learn position sizing and stop-loss placement.'
        ]
    },
    {
        chapter: 'CHAPTER 6',
        title: 'Trading Strategies',
        duration: '50 Min',
        content: [
            'Combine structure, zones, and confirmation.',
            'Execute high-probability trades.'
        ]
    },
    {
        chapter: 'CHAPTER 7',
        title: 'Trading Psychology',
        duration: '30 Min',
        content: [
            'Build discipline and consistency.',
            'Avoid revenge and over-trading.'
        ]
    }
]
export default function CourseContent() {

    const [activeIndex, setActiveIndex] = useState(0)
    return (
        <div className={styles.courseContentUser}>
            <div className={styles.childwidth}>
                <motion.div
                    className={styles.title}
                    variants={titleAnim}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.6 }}
                >
                    <h2>Course content</h2>
                </motion.div>
                <div className={styles.allBoxAlignment}>
                    {courseData.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.box}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            {/* HEADER */}
                            <div
                                className={styles.boxHeader}
                                onClick={() =>
                                    setActiveIndex(activeIndex === index ? null : index)
                                }
                            >
                                <h3>
                                    {item.chapter}
                                    <span> {item.title}</span>
                                </h3>
                                <p>{item.duration}</p>
                            </div>

                            {/* BODY */}
                            <AnimatePresence initial={false}>
                                {activeIndex === index && (
                                    <motion.div
                                        className={classNames(styles.boxBody, styles.show)}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                                    >
                                        <motion.div
                                            className={styles.spacing}
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {item.content.map((text, i) => (
                                                <p key={i}>{text}</p>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
                <Reviews smallFont />

            </div>
        </div>
    )
}
