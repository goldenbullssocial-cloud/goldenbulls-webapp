'use client'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Navigation,
} from "swiper/modules";
import styles from './blogSection.module.scss';
import LeftIcon from '@/icons/leftIcon';
import Link from 'next/link';
import { getAllBlogs } from '@/services/blog';
const BlogImage = '/assets/images/blog-image.png';
import LibraryIcon from '@/icons/libraryIcon';

export default function BlogSection() {
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await getAllBlogs();
            if (res && res.payload) {
                // Flatten the nested structure: each item has a blogs array
                const allBlogs = (res.payload.data || []).flatMap(item => item.blogs || []);
                setBlogs(allBlogs);
            }
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.blogSectionAlignment}>
            <div className='container-md'>
                <div className={styles.title}>
                    <h2>
                        Financial Insights & Articles
                    </h2>
                </div>
                <div className={styles.relative}>
                    {blogs?.length > 0 ? (
                        <>
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
                                        blogs?.map((item, index) => {
                                            return (
                                                <SwiperSlide key={index}>
                                                    <div className={styles.card}>
                                                        <div className={styles.cardImage}>
                                                            <img src={
                                                                item?.coverImage || BlogImage
                                                            } alt='BlogImage' />
                                                        </div>
                                                        <div className={styles.details}>
                                                            <h3>
                                                                {item?.title}
                                                            </h3>
                                                            <div className={styles.twoContent}>
                                                                <span>
                                                                    {item?.name || 'Admin'}
                                                                </span>
                                                                <ul>
                                                                    <li>
                                                                        {item?.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric'
                                                                        }) : " "}
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
                        </>
                    ) : (
                        <div className={styles.noData}>
                            <div className={styles.iconWrapper}>
                                <LibraryIcon />
                            </div>
                            <h3>No blogs available</h3>
                            <p>We are currently writing new articles. Please check back later for fresh financial insights.</p>
                        </div>
                    )}
                </div>
                {blogs?.length > 0 && (
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
                )}
            </div>
        </div>
    )
}
