import React from 'react'
import styles from './calculatorDetailsBanner.module.scss';

export default function CalculatorDetailsBanner({ title = 'Currency Correlation', highlightWord = 'Correlation', description = 'Analyze how different currency pairs move in relation to each other.' }) {
    const titleParts = title.split(highlightWord)
    
    return (
        <div className={styles.economicCalendarBanner}>
            <div className='container-md'>
                <h1>
                    {titleParts[0]}<span> {highlightWord} </span>{titleParts[1]} Calculator
                </h1>
                <p>
                    {description}
                </p>
            </div>
        </div>
    )
}
