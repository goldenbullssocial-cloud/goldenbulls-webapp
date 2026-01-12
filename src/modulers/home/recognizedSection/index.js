import React from 'react'
import styles from './recognizedSection.module.scss';
import Marquee from 'react-fast-marquee';
const CounterIcon = '/assets/icons/counter.svg';
const TrustpilotIcon = '/assets/icons/trustpilot.svg';
const GoogleIcon = '/assets/icons/google.svg';
const DummyLogoIcon = '/assets/icons/dummy-logo.svg';
export default function RecognizedSection() {
    return (
        <div className={styles.recognizedSection}>
            <div className='container-md'>
                <div className={styles.grid}>
                    <div className={styles.griditems}>
                        <div className={styles.box}>
                            <h3>
                                Real Reviews. Real Experiences.
                            </h3>
                            <div className={styles.twoAlignment}>
                                <div>
                                    <img src={CounterIcon} alt='CounterIcon' />
                                    <span>
                                        Average Rating
                                    </span>
                                </div>
                                <div>
                                    <img src={TrustpilotIcon} alt='TrustpilotIcon' />
                                </div>
                            </div>
                        </div>
                        <div className={styles.box}>
                            <h3>
                                Rated & Reviewed Worldwide
                            </h3>
                            <div className={styles.twoAlignment}>
                                <div>
                                    <img src={CounterIcon} alt='CounterIcon' />
                                    <span>
                                        Average Rating
                                    </span>
                                </div>
                                <div>
                                    <img src={GoogleIcon} alt='GoogleIcon' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.griditems}>
                        <div className={styles.textstyle}>
                            <h3>
                                Recognized by Leading Media
                            </h3>
                            <p>
                                Our training philosophy, educational resources, and structured learning approach have been acknowledged by
                                reputable digital publications and financial learning platforms worldwide.
                            </p>
                        </div>
                        <div className={styles.bottomSpacing}>
                            <Marquee>
                                {
                                    [...Array(10)].map(() => {
                                        return (
                                            <div className={styles.smallBox}>
                                                <img src={DummyLogoIcon} alt='DummyLogoIcon' />
                                            </div>
                                        )
                                    })
                                }
                            </Marquee>
                        </div>
                        <div className={styles.bottomSpacing}>
                            <Marquee direction='right'>
                                {
                                    [...Array(10)].map(() => {
                                        return (
                                            <div className={styles.smallBox}>
                                                <img src={DummyLogoIcon} alt='DummyLogoIcon' />
                                            </div>
                                        )
                                    })
                                }
                            </Marquee>
                        </div>
                        <Marquee >
                            {
                                [...Array(10)].map(() => {
                                    return (
                                        <div className={styles.smallBox}>
                                            <img src={DummyLogoIcon} alt='DummyLogoIcon' />
                                        </div>
                                    )
                                })
                            }
                        </Marquee>
                    </div>
                </div>
            </div>
        </div>
    )
}
