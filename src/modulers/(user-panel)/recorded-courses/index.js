"use client";
import React, { useEffect, useState } from 'react'
import styles from './recorded-courses.module.scss';
import CommonCourses from './commonCourses';
import { getCourseByType } from '@/services/dashboard';

export default function RecordedCourses() {
    const [courses, setCourses] = useState(null);

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

    return (
        <div className={styles.recordedCourses}>
            <CommonCourses title='Recorded Courses' courses={courses?.recorded} />
            <CommonCourses title='live online Courses' courses={courses?.live} />
            <CommonCourses title='In-person Courses' courses={courses?.physical} />
        </div>
    )
}
