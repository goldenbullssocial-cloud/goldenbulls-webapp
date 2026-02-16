"use client";
import React, { useState, useEffect } from "react";
import LeftIcon from "@/icons/leftIcon";
import styles from "./youTube.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getAllYoutube } from "@/services/youtube";

const PlayIcon = "/assets/icons/youTubePlay.svg";

export default function YouTube() {
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);
    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setVideosLoading(true);
            const res = await getAllYoutube({ page: 1, limit: 10 });

            if (res && res.payload) {
                setVideos(res?.payload?.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch videos", error);
        } finally {
            setVideosLoading(false);
        }
    };

    return (
        <div className={styles.youTube}>
            <div className="container-md">
                <div className={styles.title}>
                    <h2>Youtube corner</h2>
                </div>

                <div className={styles.sliderContainer}>
                    <div className={styles.paginationWrapper}>
                        {videosLoading ? (
                            <div className={styles.skeletonWrapper}>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div key={index} className={styles.skeletonSlide}>
                                        <div className={styles.card}>
                                            <div className={`${styles.imageWrapper} ${styles.skeleton}`} style={{ height: '240px', width: '100%', borderRadius: '16px' }}></div>
                                            <div className={`${styles.description} ${styles.skeleton}`} style={{ height: '20px', marginTop: '16px', width: '80%', borderRadius: '4px' }}></div>
                                            <div className={`${styles.description} ${styles.skeleton}`} style={{ height: '20px', marginTop: '8px', width: '60%', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Swiper
                                effect={"coverflow"}
                                grabCursor={true}
                                centeredSlides={true}
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 0,
                                    depth: 100,
                                    modifier: 2.5,
                                    slideShadows: false,
                                }}
                                modules={[Pagination, Navigation]}
                                spaceBetween={28}
                                slidesPerView={1}
                                pagination={{ clickable: true }}
                                onBeforeInit={(swiper) => {
                                    swiper.params.navigation = swiper.params.navigation || {};
                                }}
                                onInit={(swiper) => {
                                    if (swiper.navigation) {
                                        swiper.navigation.init();
                                        swiper.navigation.update();
                                    }
                                }}
                                navigation={{
                                    prevEl,
                                    nextEl,
                                }}
                                loop={videos.length > 3}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        centeredSlides: false,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        centeredSlides: false,
                                    },
                                }}
                                className={styles.swiper}
                            >
                                {videos.map((item, index) => (
                                    <SwiperSlide key={index} className={styles.slide}>
                                        <a
                                            href={item.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.card}
                                        >
                                            <div className={styles.imageWrapper}>
                                                <img src={item.thumbnail || "/assets/images/courses-image-1.png"} alt="Video thumbnail" />
                                                <div className={styles.playOverlay}>
                                                    <img src={PlayIcon} alt="Play Icon" />
                                                </div>
                                            </div>
                                            <p className={styles.description}>{item.description}</p>
                                        </a>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    <div className={styles.twoButtonAlignment}>
                        <button ref={setPrevEl} className={styles.navBtn}>
                            <LeftIcon />
                        </button>
                        <button ref={setNextEl} className={styles.rightButton}>
                            <LeftIcon />
                        </button>
                    </div>
                </div>

                <motion.div
                    className={styles.buttonCenter}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Link href="/youtube">
                        <button>
                            <span>See All Videos</span>
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

