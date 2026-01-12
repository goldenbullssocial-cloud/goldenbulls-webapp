"use client";
import React, { useEffect, useState } from 'react'
import CoursesBanner from './coursesBanner'
import OnDemandCourses from './onDemandCourses'
import TrustedSection from './trustedSection'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'
import { topCoursesData } from '@/constants'
import { getCourseByType } from '@/services/dashboard';

export default function Courses() {
      const [courses, setCourses] = useState([]);
      
        useEffect(() => {
          const fetchCourses = async () => {
            try {
              const response = await getCourseByType();
              setCourses(response.payload.courses);
            } catch (error) {
              console.error("Error fetching courses:", error);
            }
          };
          fetchCourses();
        }, []);

    return (
        <div>
            <CoursesBanner />
            <OnDemandCourses title='Recorded courses' data={courses?.recorded} bgColor='#0C0C0C' />
            <OnDemandCourses title="Live online courses" data={courses?.live} bgColor='#000' />
            <OnDemandCourses title='In person courses' data={courses?.physical} bgColor='#0C0C0C' />
            <TrustedSection />
            <ClassroominYourPocket spacingRemove />
            <FaqSection />
        </div>
    )
}
