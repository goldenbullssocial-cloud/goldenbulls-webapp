import React from 'react'
import styles from './calculatorDetailsBanner.module.scss';
export default function CalculatorDetailsBanner() {
    return (
        <div className={styles.economicCalendarBanner}>
            <div className='container-md'>
                <h1>
                    Currency <span> Correlation </span> Calculator
                </h1>
                <p>
                    Analyze how different currency pairs move in relation to each other.
                </p>
            </div>
        </div>
    )
}
