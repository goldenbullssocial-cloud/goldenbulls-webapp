'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './faqSection.module.scss'
import DownIcon from '@/icons/downIcon'

const faqData = [
    {
        question: 'Do I need any prior knowledge before starting the courses?',
        answer:
            'No prior knowledge is required. Our courses are designed to accommodate learners at all levels, from beginners to those with some prior experience.',
    },
    {
        question: 'Is this course suitable for beginners?',
        answer:
            'Yes, the course is designed for beginners as well as intermediate learners.',
    },
    {
        question: 'Will I get lifetime access to the course?',
        answer:
            'Yes, once enrolled you will get lifetime access to all course materials.',
    },
    {
        question: 'Do you provide certificates after completion?',
        answer:
            'Yes, certificates are provided after successful course completion.',
    },
    {
        question: 'Are live sessions included?',
        answer:
            'Yes, live market sessions are included in selected plans.',
    },
    {
        question: 'Can I access the course on mobile?',
        answer:
            'Yes, the course is fully mobile-friendly.',
    },
    {
        question: 'Is mentor support available?',
        answer:
            'You will get community and mentor support.',
    },
    {
        question: 'Is there a refund policy?',
        answer:
            'Yes, refund policy applies as per terms & conditions.',
    },
]

export default function FaqSection() {
    const [activeIndex, setActiveIndex] = useState(null)

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const leftFaqs = faqData.slice(0, 4)
    const rightFaqs = faqData.slice(4, 8)

    const renderFaq = (item, index) => (
        <motion.div
            key={index}
            className={styles.faqItem}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className={styles.mainFaq}>
                <div
                    className={styles.faqHeader}
                    onClick={() => toggleFaq(index)}
                >
                    <h3>{item.question}</h3>

                    <motion.div
                        className={styles.icon}
                        animate={{ rotate: activeIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <DownIcon />
                    </motion.div>
                </div>

                <AnimatePresence initial={false}>
                    {activeIndex === index && (
                        <motion.div
                            className={styles.faqBody}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                        >
                            <div className={styles.spacing}>
                                <p>{item.answer}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )

    return (
        <div className={styles.faqSectionAlignment}>
            <div className="container-md">

                {/* SECTION TITLE */}
                <motion.div
                    className={styles.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <h2>Frequently Asked Questions</h2>
                </motion.div>

                {/* LEFT + RIGHT COLUMNS */}
                <div className={styles.faqGrid}>
                    <div>
                        <div className={styles.column}>
                            {leftFaqs.map((item, index) =>
                                renderFaq(item, index)
                            )}
                        </div>
                    </div>

                    <div>
                        <div className={styles.column}>
                            {rightFaqs.map((item, index) =>
                                renderFaq(item, index + 4)
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
