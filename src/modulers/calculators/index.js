import React from 'react'
import EconomicCalendarCard from './economicCalendarCard'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'
import CalculatorBanner from './calculatorBanner'

export default function EconomicCalendar() {
    return (
        <div>
            <CalculatorBanner />
            <EconomicCalendarCard />
            <ClassroominYourPocket />
            <FaqSection />
        </div>
    )
}
