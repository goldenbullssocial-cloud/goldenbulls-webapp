'use client'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './shapingConfident.module.scss'
import { shapingConfidentData } from '@/constants'
const BoxImage = '/assets/images/box.png'
const LearningIcon = '/assets/icons/learning.svg'
const LeftFrame = '/assets/icons/left-frame.png'

// Number of cards
const cards = Array(5).fill(null)

export default function ShapingConfident() {
    return (
        <div className={styles.shapingConfident}>
            {/* <div className={styles.leftframe}>
                <img src={LeftFrame} alt='LeftFrame' />
            </div> */}
            <div className="container-md">
                <div className={styles.grid}>
                    {/* Left Side Box with Cards */}
                    <div className={styles.griditems}>
                        {/* BOX IMAGE */}
                        <div className={styles.image}>
                            <img src={BoxImage} alt="BoxImage" />
                        </div>

                        {/* MASK AREA (INSIDE BOX) */}
                        <div className={styles.allBoxalignment}>
                            <motion.div
                                style={{ willChange: 'transform' }}
                                animate={{ y: ['0%', '-50%'] }}
                                transition={{
                                    duration: 12,
                                    ease: 'linear',
                                    repeat: Infinity,
                                }}
                            >
                                {shapingConfidentData.map((item, index) => (
                                    <div className={styles.box} key={item.id}>
                                        <div className={styles.icon}>
                                            <img src={item.icon} alt="LearningIcon" />
                                        </div>
                                        <h4>
                                            {item.title.map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </h4>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Side Text */}
                    <div className={styles.griditems}>
                        <motion.div
                            className={styles.text}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: { staggerChildren: 0.2 },
                                },
                            }}
                        >
                            {/* Title */}
                            <motion.h2
                                variants={{
                                    hidden: { opacity: 0, y: 20, scale: 0.98 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                        transition: { duration: 0.6, ease: 'easeOut' },
                                    },
                                }}
                            >
                                Shaping Confident
                                <br />
                                Finance Learners
                            </motion.h2>

                            {/* Paragraphs */}
                            {[
                                `Many traders join academies, watch lessons, and still feel confused when they face real market charts. The market keeps changing, new strategies evolve, and trading technology updates faster than ever, but most traders are taught outdated methods with little real support. What’s missing is clear guidance and practical understanding. "Golden Bulls Academy" was built from over five years of experience in this industry, focusing on modern strategies, evolving market technology, and real trading conditions.`,
                                `We help traders learn how to adapt, manage risk with confidence, and trade with clarity instead of guesswork.`,
                            ].map((text, i) => (
                                <motion.p
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
                                    }}
                                >
                                    {text}
                                </motion.p>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
