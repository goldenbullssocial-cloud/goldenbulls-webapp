import EconomicCalendarBanner from '@/modulers/calculators/economicCalendarBanner'
import CalenderData from '@/modulers/calender/CalenderData'
import FaqSection from '@/modulers/home/faqSection'
import React from 'react'

const Calender = () => {
  return (
    <>
      <EconomicCalendarBanner />
      <CalenderData />
      <FaqSection />
    </>
  )
}

export default Calender