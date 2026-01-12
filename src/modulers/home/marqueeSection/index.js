import React from 'react'
import styles from './marqueeSection.module.scss';
import StarBlackIcon from '@/icons/starBlackIcon';
import Marquee from "react-fast-marquee";

export default function MarqueeSection() {

    const marqueeTexts = [
        "Learn From Pro Traders",
        "Master Technical Analysis",
        "From Beginner to Pro Trader"
    ];

    return (
        <div className={styles.marqueeSection}>
            <Marquee>
                {
                    [...Array(25)].map((_, index) => {
                        return (
                            <div key={index} className={styles.icontext}>
                                <StarBlackIcon />
                                <span>
                                    {marqueeTexts[index % marqueeTexts.length]}
                                </span>
                            </div>
                        )
                    })
                }
            </Marquee>
        </div>
    )
}
