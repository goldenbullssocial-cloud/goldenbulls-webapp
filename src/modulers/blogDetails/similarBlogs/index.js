'use client'
import React, { useState } from "react";
import styles from './similarBlogs.module.scss';
import { motion } from "framer-motion";
import classNames from 'classnames';
import DownPrimaryIcon from '@/icons/downPrimaryIcon';
const BlogImage = '/assets/images/blog-card.png';

/* Container animation */
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

/* Card animation */
const cardVariants = {
    hidden: {
        opacity: 0,
        y: 24,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};
export default function SimilarBlogs() {
    const [toggle, setToggle] = React.useState(false);

    return (
        <div className={styles.similarBlogs}>
            <div className="container-md">
                <div className={styles.sectionHeaderAlignment}>
                    <div className={styles.title}>
                        <div className={styles.text}>
                            <h2>Latest Blogs</h2>
                        </div>
                    </div>
                    <div className={styles.line}></div>
                    {/* <div className={styles.buttonAlignent}>
            <CategoryPopover
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div> */}
                    <div className={styles.relativeDiv}>
                        <button>
                            <span>
                                All Categories
                            </span>
                            <div className={classNames(styles.icons, toggle ? styles.rotate : "")} onClick={() => setToggle(!toggle)}>
                                <DownPrimaryIcon />
                            </div>
                            <div className={classNames(styles.dropdown, toggle ? styles.show : styles.hide)}>
                                <div className={styles.dropdownDesign}>
                                    <div className={styles.dropdownSpacing}>
                                        <p>All Categories</p>
                                        <p>All Categories</p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* 👇 Grid container animation */}
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {
                        [...Array(4)].map((_, i) => {
                            return (
                                <motion.div key={i} className={styles.griditems} variants={cardVariants}>
                                    <div className={styles.cardImage}>
                                        <img src={BlogImage} alt={BlogImage} />
                                    </div>

                                    <div className={styles.details}>
                                        <h3>The Beginner’s Roadmap to Understanding Financial Markets</h3>
                                        <div className={styles.twoContentAlignment}>
                                            <span>Johnathan Doe</span>
                                            <ul>
                                                <li>19 November 2023</li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    }
                </motion.div>

            </div>
        </div>
    )
}
