'use client'
import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import styles from './whyChoose.module.scss';
const RightVec = '/assets/images/right-layer.png'
import { whyChooseData } from '@/constants';
import StarIcon from '@/icons/starIcon';

export default function WhyChoose() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const titleInView = useInView(titleRef, { once: true });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const iconVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };
    return (
        <div className={styles.whyChooseAlignment} ref={containerRef}>
            <div className='container-md'>
                <div className={styles.text}>
                    <h2>
                        Why choose golden bulls academy
                    </h2>
                </div>
                <div className={styles.allBoxAlignment}>
                    {whyChooseData.map((item, index) => {
                        const itemsLength = whyChooseData.length;
                        const scale = useTransform(
                            scrollYProgress,
                            [(index * 1) / itemsLength, 1],
                            [1, 1 - (itemsLength - index) * 0.01]
                        );

                        return (
                            <motion.div
                                key={item.id}
                                className={styles.box}
                                style={{
                                    scale,
                                    position: 'sticky',
                                    top: `calc(120px + ${index * 20}px)`,
                                }}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <div className={styles.textgrid}>
                                    <div className={styles.content}>
                                        <h2>
                                            <span className={styles.fontfamily}>{item.step}. </span>
                                            <span className={styles.textcolor}>{item.title.split(' ').slice(0, -1).join(' ')}</span> {item.title.split(' ').slice(-1)}
                                        </h2>
                                        <p>
                                            {item.description}
                                        </p>
                                        <div className={styles.icon}>
                                            <img src={item.image} alt={item.title} />
                                        </div>
                                    </div>
                                    <div className={styles.list}>
                                        {item.highlights.map((highlight, idx) => (
                                            <div className={styles.iconText} key={idx}>
                                                <span >
                                                    ✦  {highlight}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.mobileicon}>
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                </div>
                                <div className={styles.rightvec}>
                                    <img src={RightVec} alt='RightVec' />
                                </div>
                            </motion.div>

                        );
                    })}
                </div>
            </div>
        </div>
    )
}
