'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Navigation,
} from "swiper/modules";
import styles from './blogSection.module.scss';
import LeftIcon from '@/icons/leftIcon';
import Link from 'next/link';
const BlogImage = '/assets/images/blog-image.png';
export default function BlogSection() {
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);
    return (
        <div className={styles.blogSectionAlignment}>
            <div className='container-md'>
                <div className={styles.title}>
                    <h2>
                        Financial Insights & Articles
                    </h2>
                </div>
                <div className={styles.relative}>
                    <div className={styles.paginationWrapper}>
                        <Swiper
                            effect={"coverflow"}
                            grabCursor={true}
                            loop={true}
                            slidesPerView={"3"}

                            onBeforeInit={(swiper) => {
                                swiper.params.navigation = swiper.params.navigation || {};
                            }}
                            onInit={(swiper) => {
                                if (swiper.navigation) {
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                }
                            }}
                            navigation={{ prevEl, nextEl }}
                            spaceBetween={28}
                            speed={800}

                            pagination={{
                                clickable: true
                            }}
                            modules={[Pagination, Navigation]}
                            breakpoints={{
                                1800: {
                                    slidesPerView: 3,
                                },

                                1200: {
                                    slidesPerView: 3,
                                },
                                1024: {
                                    slidesPerView: 2,
                                },
                                576: {
                                    slidesPerView: 1,
                                    spaceBetween: 30,
                                },
                                480: {
                                    slidesPerView: 1,
                                    spaceBetween: 12,
                                },
                                360: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                            }}
                        >
                            {
                                [...Array(5)].map((_, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <div className={styles.card}>
                                                <div className={styles.cardImage}>
                                                    <img src={BlogImage} alt='BlogImage' />
                                                </div>
                                                <div className={styles.details}>
                                                    <h3>
                                                        Forex trading masterclass for absolute beginners, and market enthusiasts
                                                    </h3>
                                                    <div className={styles.twoContent}>
                                                        <span>
                                                            Johnathan Doe
                                                        </span>
                                                        <ul>
                                                            <li>
                                                                19 November 2023
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )
                                })
                            }

                        </Swiper>
                    </div>
                    <div className={styles.twoButtonAlignment}>
                        <button
                            ref={setPrevEl}
                            className={`${styles.navBtn}`}
                        >
                            <LeftIcon />
                        </button>
                        <button
                            ref={setNextEl}
                            className={`${styles.rightButton}`}
                        >
                            <LeftIcon />

                        </button>
                    </div>
                </div>
                <div>
                    <motion.div
                        className={styles.buttonCenter}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <Link href="/blog">
                            <button>
                                <span>See All Blogs</span>
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
