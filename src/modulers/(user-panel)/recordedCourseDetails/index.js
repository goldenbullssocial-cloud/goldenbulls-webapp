"use client";
import React, { useEffect, useState } from 'react'
import styles from './recordedCourseDetails.module.scss';
import CourseDetails from './courseDetails';
import CourseContent from './courseContent';
import CommonCourses from '../recorded-courses/commonCourses';
import { getCourseByType } from '@/services/dashboard';
import { useSearchParams } from 'next/navigation';

export default function RecordedCourseDetails() {
    const [courses, setCourses] = useState(null);
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await getCourseByType();

                if (res && res.payload) {
                    setCourses(res?.payload?.courses);
                } else if (res) {
                    setCourses(res);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses?.[type]?.filter(item => item._id !== id) || [];

    return (
        <div className={styles.recordedCourseDetails}>
            <CourseDetails />
            <CourseContent />
            <CommonCourses title='related courses' courses={filteredCourses} />
        </div>
    )
}
