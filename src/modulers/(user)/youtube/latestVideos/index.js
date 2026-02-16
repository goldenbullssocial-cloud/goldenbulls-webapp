"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./latestVideos.module.scss";
import Pagination from "@/components/pagination";
import Link from "next/link";
import NoData from "@/components/noData";
import LibraryIcon from "@/icons/libraryIcon";
import { getAllYoutube } from "@/services/youtube";

const ITEMS_PER_PAGE = 12;

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
        // opacity: 0,
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

export default function LatestVideos() {
    const [currentPage, setCurrentPage] = useState(1);
    const [videos, setVideos] = useState([]);
    const [videosLoading, setVideosLoading] = useState(false);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setVideosLoading(true);
            const res = await getAllYoutube({ page: 1, limit: 12 });

            if (res && res.payload) {
                setVideos(res?.payload?.data);
            }
        } catch (error) {
            console.error("Failed to fetch videos", error);
        } finally {
            setVideosLoading(false);
        }
    };

    // Calculate pagination - now using all blogs since filtering is done by API
    const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentVideos = videos.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className={styles.latestBlog}>
            <div className="container-md">
                <div className={styles.sectionHeaderAlignment}>
                    <div className={styles.title}>
                        <div className={styles.text}>
                            <h2>All Youtube Videos</h2>
                        </div>
                    </div>
                    <div className={styles.line}></div>
                </div>

                {/* 👇 Grid container animation */}
                <motion.div
                    key={`${currentPage}`}
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {videosLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <div className={styles.griditems} key={index}>
                                <div className={`${styles.cardImage} ${styles.skeleton} ${styles.skeletonImage}`} />
                                <div className={styles.details}>
                                    <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                                    <div className={styles.twoContentAlignment}>
                                        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "50%" }} />
                                        <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%" }} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : currentVideos?.length > 0 ? (
                        currentVideos.map((video, index) => (
                            <Link key={index} href={video?.videoUrl} className={styles.cardLink} target="_blank" rel="noopener noreferrer">
                                <motion.div className={styles.griditems} variants={cardVariants}>
                                    <div className={styles.cardImage}>
                                        <img src={video?.thumbnail || '/assets/images/blog-image.png'} alt={video?.description} />
                                    </div>

                                    <div className={styles.details}>
                                        <h3>{video?.description}</h3>

                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                        <NoData
                            icon={<LibraryIcon />}
                            title="No videos found"
                            description="There are no videos currently available."
                        />
                    )}
                </motion.div>

                {totalPages > 1 && (
                    <div className={styles.paginationTopAlignment}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
