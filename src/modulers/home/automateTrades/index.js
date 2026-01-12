'use client'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Pagination,
    Navigation,
} from "swiper/modules";
import styles from './automateTrades.module.scss';
import Button from '@/components/button';
import LeftIcon from '@/icons/leftIcon';

export default function AutomateTrades() {
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);
    return (
        <div className={styles.automateTrades}>
            <div className='container-md'>
                <div className={styles.title}>
                    <h2>
                        Automate Your Trades with Powerful Bots
                    </h2>
                </div>

                <div className={styles.relative}>
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
                                [...Array(5)].map((_, index) => {
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
                                                        Forex's maximum movement tracking and
                                                        analysis algobot
                                                    </p>
                                                    <div className={styles.line}></div>
                                                    <h5>
                                                        $120 <span>/Month</span>
                                                    </h5>
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
                </div>
            </div>
        </div>
    )
}
