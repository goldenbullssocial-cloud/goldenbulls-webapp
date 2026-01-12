'use client'

import React from 'react'
import styles from './getInTouch.module.scss'
import Button from '@/components/button'
import { motion } from 'framer-motion'

const AddressIcon = '/assets/icons/Address.svg'
const CallIcon = '/assets/icons/call.svg'
const GmailIcon = '/assets/icons/gmail.svg'
const FacebookIcon = '/assets/icons/facebook-outline.svg'
const InstagramIcon = '/assets/icons/instagram-outline.svg'
const TwitterIcon = '/assets/icons/twitter-outline.svg'
const LinkdinIcon = '/assets/icons/linkdin-outline.svg'

/* ---------------- Animations ---------------- */

const container = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

const fadeLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

const fadeRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

/* ---------------- Component ---------------- */

export default function GetInTouch() {
    return (
        <div className={styles.getInTouch}>
            <div className="container-md">
                <motion.div
                    className={styles.grid}
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {/* Left Content */}
                    <motion.div
                        className={styles.griditems}
                        variants={fadeLeft}
                    >
                        <motion.h2 variants={fadeUp}>get in touch</motion.h2>

                        <motion.div className={styles.icongrid} variants={fadeUp}>
                            <img src={AddressIcon} alt="AddressIcon" />
                            <div>
                                <h3>Address</h3>
                                <p>
                                    Lorem Ipsum is simply dummy text of the printing
                                    and typesetting industry. Lorem Ipsum has been the
                                    industry's standard dummy text ever.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div className={styles.icongrid} variants={fadeUp}>
                            <img src={CallIcon} alt="CallIcon" />
                            <div>
                                <h3>Contact Details</h3>
                                <a href="callto:+180052554589">
                                    +1 800-525-54-589
                                </a>
                            </div>
                        </motion.div>

                        <motion.div className={styles.icongrid} variants={fadeUp}>
                            <img src={GmailIcon} alt="GmailIcon" />
                            <div>
                                <h3>Email Us</h3>
                                <a href="mailto:test@email.com">
                                    test@email.com
                                </a>
                            </div>
                        </motion.div>

                        <motion.div className={styles.line} variants={fadeUp} />

                        <motion.div
                            className={styles.followus}
                            variants={fadeUp}
                        >
                            <span>Follow Us :</span>
                            <div className={styles.socialIcon}>
                                {[FacebookIcon, InstagramIcon, TwitterIcon, LinkdinIcon].map(
                                    (icon, i) => (
                                        <motion.img
                                            key={i}
                                            src={icon}
                                            alt="social"
                                            whileHover={{ y: -4, scale: 1.05 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        />
                                    )
                                )}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Form */}
                    <motion.div
                        className={styles.griditems}
                        variants={fadeRight}
                    >
                        <motion.div
                            className={styles.blackBox}
                            variants={container}
                        >
                            <motion.h4 variants={fadeUp}>
                                Leave Us Your Info.
                            </motion.h4>

                            <motion.div className={styles.formControl} variants={fadeUp}>
                                <input type="text" placeholder="Your Name" />
                            </motion.div>

                            <motion.div className={styles.formControl} variants={fadeUp}>
                                <input type="text" placeholder="Email Address" />
                            </motion.div>

                            <motion.div className={styles.formControl} variants={fadeUp}>
                                <textarea placeholder="Message"></textarea>
                            </motion.div>

                            <motion.div
                                className={styles.checkboxText}
                                variants={fadeUp}
                            >
                                <input type="checkbox" />
                                <label>
                                    You agree to our friendly
                                    <span> Privacy policy. </span>
                                </label>
                            </motion.div>

                            <motion.div variants={fadeUp}>
                                <Button text="Send Message" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
