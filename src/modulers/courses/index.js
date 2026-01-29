"use client";
import React from 'react'
import CoursesBanner from './coursesBanner'
import OnDemandCourses from './onDemandCourses'
import TrustedSection from './trustedSection'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'

export default function Courses() {
  return (
    <div>
      <CoursesBanner />
      <OnDemandCourses title='Recorded courses' activeType={"recorded"} bgColor='#0C0C0C' />
      <OnDemandCourses title="Live online courses" activeType={"live"} bgColor='#000' />
      <OnDemandCourses title='In person courses' activeType={"physical"} bgColor='#0C0C0C' />
      <TrustedSection />
      <ClassroominYourPocket spacingRemove />
      <FaqSection />
    </div>
  )
}
