import React from 'react'
import styles from './classroominYourPocket.module.scss';
import classNames from 'classnames';
const AppStoreImage = '/assets/icons/app-store.svg';
const GooglePlayImage = '/assets/icons/google-play.svg';
const MobileFrameImage = '/assets/images/mobile-frame.png';
export default function ClassroominYourPocket({ spacingRemove }) {
    return (
        <div className={classNames(styles.classroominYourPocket, spacingRemove ? styles.spacingRemove : "")}>
            <div className='container-md'>
                <div className={styles.box}>
                    <div className={styles.text}>
                        <h2>
                            Your Financial
                            Classroom in Your Pocket
                        </h2>
                        <p>
                            Stay connected to your learning journey anytime, anywhere with the Golden Bulls mobile app. Access all your courses, track your progress, rewatch lessons, and stay engaged with our community—all
                            from your phone.
                        </p>
                        <div className={styles.twoButtonAlignment}>
                            <img src={AppStoreImage} alt='AppStoreImage' />
                            <img src={GooglePlayImage} alt='GooglePlayImage' />
                        </div>
                    </div>
                    <div className={styles.image}>
                        <img src={MobileFrameImage} alt='MobileFrameImage' />
                    </div>
                </div>
            </div>
        </div>
    )
}
