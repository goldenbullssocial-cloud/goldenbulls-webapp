'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './liveCourses.module.scss';
import CoursesCard from '@/components/coursesCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};
export default function LiveCourses() {
    return (
        <motion.section
            className={styles.liveCourses}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
        >
            <div className="container-md">

                {/* Title */}
                <motion.div className={styles.title} variants={itemVariants}>
                    <div className={styles.text}>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            live online courses
                        </motion.h2>
                    </div>

                    {/* Animated line */}
                    <motion.div
                        className={styles.line}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        style={{ originX: 0 }}
                        viewport={{ once: true }}
                    />
                </motion.div>

                {/* Cards Grid */}
                <motion.div className={styles.grid} variants={containerVariants}>
                    {[1, 2, 3].map((_, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <CoursesCard />
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </motion.section>
    )
}
