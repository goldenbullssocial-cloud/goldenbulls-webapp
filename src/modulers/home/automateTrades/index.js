'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Navigation,
} from "swiper/modules";
import styles from './automateTrades.module.scss';
import Button from '@/components/button';
import LeftIcon from '@/icons/leftIcon';
import { getBots, getAlgobot } from '@/services/dashboard';
import { getCookie } from '../../../../cookie';

import AlgobotsIcon from '@/icons/algobotsIcon';

export default function AutomateTrades() {
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);
    const [bots, setBots] = useState([]);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [selectedPlans, setSelectedPlans] = useState({});
    const [user, setUser] = useState(null);
    const [categoryId, setCategoryId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userCookie = getCookie("user");
        if (userCookie) {
            try {
                const userData = JSON.parse(userCookie);
                setUser(userData);
            } catch (error) {
                console.error("Error parsing user cookie:", error);
            }
        }
    }, []);

    useEffect(() => {
        const fetchBots = async () => {
            try {
                setLoading(true);
                if (user) {
                    const data = await getAlgobot(categoryId, searchQuery, page, limit);
                    setBots(data?.payload?.result || []);
                } else {
                    const response = await getBots(page, limit);
                    const allStrategies = response?.payload?.data || [];
                    setBots(allStrategies);
                }
            } catch (error) {
                console.error("Error fetching bots:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBots();
    }, [user, categoryId, searchQuery, page, limit]);

    const handleSubscribeClick = (botId) => {
        if (user) {
            router.push(`/algobots?botId=${botId}&showModal=true`);
        } else {
            router.push('/login');
        }
    };
    return (
        <div className={styles.automateTrades}>
            <div className='container-md'>
                <div className={styles.title}>
                    <h2>
                        Automate Your Trades with Powerful Bots
                    </h2>
                </div>

                <div className={styles.relative}>
                    {loading ? (
                        <div className={styles.paginationWrapper}>
                            <div className={styles.skeletonWrapper}>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className={styles.skeletonSlide}>
                                        <div className={`${styles.box} ${styles.skeletonBox}`}>
                                            <div className={styles.skeletonDetailsBox}>
                                                <div className={`${styles.statItem} ${styles.skeletonText} ${styles.skeleton}`} style={{ width: '120px', height: '16px', marginBottom: '8px' }} />
                                                <div className={`${styles.statItem} ${styles.skeletonText} ${styles.skeleton}`} style={{ width: '80px', height: '16px' }} />
                                            </div>

                                            <div className={styles.contentBody}>
                                                <div className={styles.titleSection}>
                                                    <div className={`${styles.skeletonTitle} ${styles.skeleton}`} />
                                                </div>

                                                <div className={styles.planSection}>
                                                    <div className={`${styles.skeletonPlan} ${styles.skeleton}`} />
                                                </div>

                                                <div className={styles.actionBtn}>
                                                    <div className={`${styles.skeletonButton} ${styles.skeleton}`} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : bots?.length > 0 ? (
                        <>
                            <div className={styles.paginationWrapper}>
                                <Swiper
                                    effect={"coverflow"}
                                    grabCursor={true}
                                    loop={true}
                                    slidesPerView={"4"}

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
                                    spaceBetween={24}
                                    speed={800}

                                    pagination={{
                                        clickable: true,
                                    }}
                                    modules={[Pagination, Navigation]}
                                    breakpoints={{
                                        1800: {
                                            slidesPerView: 4,
                                        },

                                        1200: {
                                            slidesPerView: 4,
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
                                        bots.map((item, index) => {
                                            return (
                                                <SwiperSlide key={index}>
                                                    <div className={styles.box}>
                                                        <div className={styles.detailsBox}>
                                                            <h3>
                                                                Returns: <span className={styles.green}>110%</span> <small>(28 Days)</small>
                                                            </h3>
                                                            <h4>
                                                                Risk: <span>High</span>
                                                            </h4>
                                                        </div>
                                                        <div className={styles.leftRightAlignment}>
                                                            <p>
                                                                {item?.title}
                                                            </p>
                                                            <div className={styles.line}></div>
                                                            <div
                                                                className={styles.dropdownContainer}
                                                                onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                                                            >
                                                                <span>
                                                                    ${selectedPlans[index]?.price || item?.strategyPlan[0]?.price || '0'}/{selectedPlans[index]?.planType || item?.strategyPlan[0]?.planType || 'Month'}
                                                                </span>
                                                                <div className={styles.imgIcon}>
                                                                    <img
                                                                        src="/assets/icons/vector.svg"
                                                                        alt="icon"
                                                                        style={{ transform: openDropdownIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                                                    />
                                                                </div>
                                                                {openDropdownIndex === index && (
                                                                    <div className={styles.dropdownList}>
                                                                        {item?.strategyPlan?.map((plan, planIndex) => (
                                                                            <div
                                                                                key={planIndex}
                                                                                className={styles.dropdownItem}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setSelectedPlans({ ...selectedPlans, [index]: plan });
                                                                                    setOpenDropdownIndex(null);
                                                                                }}
                                                                            >
                                                                                {plan?.price}$/{plan?.planType}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Button
                                                                text={
                                                                    user && item?.strategyPlan?.some((plan) => plan.isPayment)
                                                                        ? "See Details"
                                                                        : "Subscribe Now"
                                                                }
                                                                className={styles.btn}
                                                                onClick={() => handleSubscribeClick(item?._id)}
                                                            />
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
                                <AlgobotsIcon />
                            </div>
                            <h3>No algobots available</h3>
                            <p>We are currently updating our algobot list. Please check back later for new strategies.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
