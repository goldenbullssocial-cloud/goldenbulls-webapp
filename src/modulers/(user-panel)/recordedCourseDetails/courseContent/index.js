'use client'
import React, { useEffect, useState } from 'react'
import styles from './courseContent.module.scss';
import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import Reviews from '@/modulers/coursesDetails/reviews';
import { getChapters } from '@/services/dashboard';
import { useSearchParams } from 'next/navigation';
const CheckIcon = '/assets/icons/checkCourse.svg'
const PlayIcon = '/assets/icons/playCourse.svg'

import NoData from '@/components/noData';
import LibraryIcon from '@/icons/libraryIcon';

const titleAnim = {
    hidden: { y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.8, 0.25, 1],
        },
    },
};

export default function CourseContent({ onVideoSelect, chapters, onChaptersLoaded }) {

    const [activeIndex, setActiveIndex] = useState(0);
    const [chaptersData, setChaptersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        if (Array.isArray(chapters)) {
            setChaptersData(chapters);
            setLoading(false);
            return;
        }

        const fetchChapters = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const response = await getChapters(id);
                    const data = response?.payload?.data || (Array.isArray(response?.payload) ? response.payload : (Array.isArray(response) ? response : []));
                    setChaptersData(data);
                    if (onChaptersLoaded) onChaptersLoaded(data);

                    // Set initial video if data exists and no video selected
                    if (data && data.length > 0 && !chapters) {
                        onVideoSelect({ url: data[0]?.chapterVideo, chapterId: data[0]?.courseTracking?.chapterId, chapterTrakingId: data[0]?.courseTracking?._id, percentageCompleted: data[0]?.courseTracking?.percentage });
                    }
                } catch (error) {
                    console.error("Error fetching chapters:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchChapters();
    }, [id, chapters]);

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
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className={classNames(styles.box, styles.skeletonBox)}>
                                <div className={styles.boxHeader}>
                                    <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                                    <div className={`${styles.skeleton} ${styles.skeletonDuration}`} />
                                </div>
                            </div>
                        ))
                    ) : chaptersData?.length > 0 ? (
                        chaptersData?.map((item, index) => (
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
                                    onClick={() => {
                                        setActiveIndex(activeIndex === index ? null : index);
                                        if (item?.chapterVideo) {
                                            onVideoSelect({ url: item?.chapterVideo, chapterId: item?._id, chapterTrakingId: item?.courseTracking?._id, percentageCompleted: item?.courseTracking?.percentage });
                                        }
                                    }}
                                >
                                    <h3>
                                        CHAPTER {item?.chapterNo} <span> | {item?.chapterName}</span>
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <p>{`${item?.duration} Min` || ""}</p>
                                        {parseInt(item?.courseTracking?.percentage) >= 100 ? (
                                            <img src={CheckIcon} alt="CheckIcon" />
                                        ) : (
                                            <img src={PlayIcon} alt="PlayIcon" />
                                        )}
                                    </div>
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
                        ))
                    ) : (
                        <NoData
                            icon={<LibraryIcon />}
                            title="No content available"
                            description="We are currently updating the course content. Please check back later."
                        />
                    )}
                </div>
                <Reviews smallFont />

            </div>
        </div>
    )
}
