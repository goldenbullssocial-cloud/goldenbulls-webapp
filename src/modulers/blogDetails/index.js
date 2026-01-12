import React from 'react'
import styles from './blogDetails.module.scss';
import FaqSection from '../home/faqSection';
import SimilarBlogs from './similarBlogs';
const BlogDetailsImage = '/assets/images/blog-details-banner.png';
export default function BlogDetails() {
    return (
        <>
            <div className={styles.blogDetailsAlignment}>
                <div className='container-md'>
                    <div className={styles.blogImage}>
                        <img src={BlogDetailsImage} alt='BlogDetailsImage' />
                    </div>
                    <div className={styles.blogtitle}>
                        <h2>
                            Forex trading masterclass for absolute beginners, and market enthusiasts
                        </h2>
                        <div className={styles.twoText}>
                            <p>
                                By Johnathan Doe
                            </p>
                            <ul>
                                <li>
                                    19 November 2025
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.tableofContentDetails}>
                <div className='container-md'>
                    <div className={styles.grid}>
                        <div className={styles.griditems}>
                            <div className={styles.box}>
                                <div className={styles.boxHeader}>
                                    <h2>
                                        Table of Contents
                                    </h2>
                                </div>
                                <ol>
                                    <li>Introduction to the Forex Market</li>
                                    <li>How Currency Pairs Work</li>
                                    <li>Understanding Market Sessions</li>
                                    <li>Basic Types of Analysis</li>
                                    <li>Why Risk Management Matters</li>
                                    <li>Common Beginner Mistakes</li>
                                    <li>Building a Trading Routine</li>
                                    <li>Final Thoughts for New Traders</li>
                                </ol>
                            </div>
                        </div>
                        <div className={styles.griditems}>
                            <h3>
                                Forex trading masterclass for absolute beginners, and market enthusiasts
                            </h3>
                            <p>
                                The foreign exchange market—commonly known as forex—is the world’s largest financial market, where currencies are bought and sold every second of the day. Unlike traditional stock markets, forex operates globally and remains open 24 hours, five days a week. This accessibility makes it appealing to new learners, but it also means understanding how the market functions is essential before taking any steps. In this guide, we break down the
                                basics in simple language to help beginners build a strong foundation.
                            </p>
                            <div className={styles.spacer}></div>
                            <h3>
                                How Currency Pairs Work
                            </h3>
                            <p>
                                Forex trading always involves two currencies paired together, such as EUR/USD or GBP/JPY. The first currency is called the base, and the second is the quote. When you trade, you are effectively buying one currency while selling the other. The price of a currency pair tells you how much of the quote currency you need to buy one unit of the base currency. Understanding how these pairs move is the first step toward analyzing
                                market behavior.
                            </p>
                            <div className={styles.spacer}></div>
                            <h3>
                                Forex trading masterclass for absolute beginners, and market enthusiasts
                            </h3>
                            <p>
                                The foreign exchange market—commonly known as forex—is the world’s largest financial market, where currencies are bought and sold every second of the day. Unlike traditional stock markets, forex operates globally and remains open 24 hours, five days a week. This accessibility makes it appealing to new learners, but it also means understanding how the market functions is essential before taking any steps. In this guide, we break down the
                                basics in simple language to help beginners build a strong foundation.
                            </p>
                            <div className={styles.spacer}></div>
                            <h3>
                                How Currency Pairs Work
                            </h3>
                            <p>
                                Forex trading always involves two currencies paired together, such as EUR/USD or GBP/JPY. The first currency is called the base, and the second is the quote. When you trade, you are effectively buying one currency while selling the other. The price of a currency pair tells you how much of the quote currency you need to buy one unit of the base currency. Understanding how these pairs move is the first step toward analyzing
                                market behavior.
                            </p>
                            <div className={styles.spacer}></div>
                            <h3>
                                Forex trading masterclass for absolute beginners, and market enthusiasts
                            </h3>
                            <p>
                                The foreign exchange market—commonly known as forex—is the world’s largest financial market, where currencies are bought and sold every second of the day. Unlike traditional stock markets, forex operates globally and remains open 24 hours, five days a week. This accessibility makes it appealing to new learners, but it also means understanding how the market functions is essential before taking any steps. In this guide, we break down the
                                basics in simple language to help beginners build a strong foundation.
                            </p>
                            <div className={styles.spacer}></div>
                            <h3>
                                How Currency Pairs Work
                            </h3>
                            <p>
                                Forex trading always involves two currencies paired together, such as EUR/USD or GBP/JPY. The first currency is called the base, and the second is the quote. When you trade, you are effectively buying one currency while selling the other. The price of a currency pair tells you how much of the quote currency you need to buy one unit of the base currency. Understanding how these pairs move is the first step toward analyzing
                                market behavior.
                            </p>
                            <div className={styles.spacer}></div>
                            <h3>
                                Forex trading masterclass for absolute beginners, and market enthusiasts
                            </h3>
                            <p>
                                The foreign exchange market—commonly known as forex—is the world’s largest financial market, where currencies are bought and sold every second of the day. Unlike traditional stock markets, forex operates globally and remains open 24 hours, five days a week. This accessibility makes it appealing to new learners, but it also means understanding how the market functions is essential before taking any steps. In this guide, we break down the
                                basics in simple language to help beginners build a strong foundation.
                            </p>
                            <div className={styles.spacer}></div>
                            <h3>
                                How Currency Pairs Work
                            </h3>
                            <p>
                                Forex trading always involves two currencies paired together, such as EUR/USD or GBP/JPY. The first currency is called the base, and the second is the quote. When you trade, you are effectively buying one currency while selling the other. The price of a currency pair tells you how much of the quote currency you need to buy one unit of the base currency. Understanding how these pairs move is the first step toward analyzing
                                market behavior.
                            </p>
                            <div className={styles.spacer}></div>
                        </div>
                    </div>
                </div>
            </div>
            <SimilarBlogs />
            <FaqSection />

        </>
    )
}
