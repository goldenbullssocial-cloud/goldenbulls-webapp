'use client'
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Navigation,
} from "swiper/modules";
import styles from './automateTrades.module.scss';
import Button from '@/components/button';
import LeftIcon from '@/icons/leftIcon';
import { getBots } from '@/services/dashboard';

import AlgobotsIcon from '@/icons/algobotsIcon';

export default function AutomateTrades() {
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);
    const [bots, setBots] = useState([]);
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
    const [selectedPlans, setSelectedPlans] = useState({});

    useEffect(() => {
        const fetchBots = async () => {
            try {
                const res = await getBots();
                if (res?.payload) {
                    setBots(res?.payload?.data);
                } else if (Array.isArray(res)) {
                    setBots(res);
                }
            } catch (error) {
                console.error("Error fetching bots:", error);
            }
        };

        fetchBots();
    }, []);
    return (
        <div className={styles.automateTrades}>
            <div className='container-md'>
                <div className={styles.title}>
                    <h2>
                        Automate Your Trades with Powerful Bots
                    </h2>
                </div>

                <div className={styles.relative}>
                    {bots?.length > 0 ? (
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
                                                            <Button text="Subscribe Now" className={styles.btn} />
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
