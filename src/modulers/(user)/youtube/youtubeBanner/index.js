import React from 'react'
import styles from './youtubeBanner.module.scss';

export default function YouTubeBanner() {
    
    return (
        <div className={styles.economicCalendarBanner}>
            <div className='container-md'>
                <h1>
                    Youtube<span> Corner </span>
                </h1>
                <p>
                    Explore all our YouTube videos in one place. Featuring trading lessons, market insights, strategy breakdowns and much more.
                </p>
            </div>
        </div>
    )
}