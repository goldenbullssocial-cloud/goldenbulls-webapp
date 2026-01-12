'use client'

import React from 'react'
import { motion } from 'framer-motion'
import styles from './whatWeOffer.module.scss'

const ComputerIcon = '/assets/icons/computer.png'
const GroupComputerIcon = '/assets/icons/group-computer.png'
const PersonIcon = '/assets/icons/Person.png'
const LineImage = '/assets/images/line.png'

const offerData = [
    {
        title: '1.0 Basic to Advance Price Action Course',
        description:
            'Real time market breakdowns and actionable insights to improve your decision making.',
        icon: ComputerIcon,
    },
    {
        title: '2.0 SMC + ICT Advance Course',
        description:
            'Participate in dynamic, scheduled live online sessions led by an expert instructor.',
        icon: GroupComputerIcon,
    },
    {
        title: 'Personal Mentorship',
        description:
            'Engage in face to face learning conducted in a dedicated physical training environment.',
        icon: PersonIcon,
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
}

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
}

export default function WhatWeOffer() {
    return (
        <section className={styles.whatWeOffer}>
            <div className="container-md">

                {/* Title animation */}
                <motion.div
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2>what we offer</h2>
                </motion.div>

                {/* Grid */}
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {offerData.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.griditems}
                            variants={itemVariants}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 },
                            }}
                        >
                            {/* Rotating line */}
                            <motion.div className={styles.lineImage}>
                                <img src={LineImage} alt="Line" />
                            </motion.div>

                            {/* Icon pop */}
                            <motion.div
                                className={styles.iconCemter}
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                            >
                                <img src={item.icon} alt={item.title} />
                            </motion.div>

                            {/* Text */}
                            <div className={styles.details}>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>
                        </motion.div>
                    ))}

                </motion.div>
            </div>
        </section>
    )
}
