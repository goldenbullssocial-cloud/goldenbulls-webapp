import React from 'react'
import EconomicCalendarBanner from './economicCalendarBanner'
import EconomicCalendarCard from './economicCalendarCard'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'

export default function EconomicCalendar() {
    return (
        <div>
            <EconomicCalendarBanner />
            <EconomicCalendarCard />
            <ClassroominYourPocket />
            <FaqSection />
        </div>
    )
}
