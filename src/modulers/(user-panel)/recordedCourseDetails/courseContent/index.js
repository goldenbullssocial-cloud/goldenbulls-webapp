'use client'
import React, { useEffect, useState } from 'react'
import styles from './courseContent.module.scss';
import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import Reviews from '@/modulers/coursesDetails/reviews';
import { getCourseSyllabus } from '@/services/dashboard';
import { useSearchParams } from 'next/navigation';
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
export default function CourseContent() {

    const [activeIndex, setActiveIndex] = useState(0);
    const [syllabusData, setSyllabusData] = useState([]);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        const fetchSyllabus = async () => {
            if (id) {
                try {
                    const response = await getCourseSyllabus(id);
                    
                    const data = response?.payload?.data || (Array.isArray(response?.payload) ? response.payload : (Array.isArray(response) ? response : []));
                    setSyllabusData(data);
                } catch (error) {
                    console.error("Error fetching syllabus:", error);
                }
            }
        };
        fetchSyllabus();
    }, [id]);

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
                    {syllabusData?.map((item, index) => (
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
                                    CHAPTER {index + 1}
                                    <span> {item.title}</span>
                                </h3>
                                {/* Fallback duration if not available */}
                                <p>{item.duration || ""}</p>
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
                                            {/* Use description since 'content' array doesn't exist in API */}
                                            <p>{item.description}</p>
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
