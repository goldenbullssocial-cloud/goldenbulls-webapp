"use client";
import React, { useEffect, useState } from 'react'
import styles from './recorded-courses.module.scss';
import CommonCourses from './commonCourses';
import { getCourseByType } from '@/services/dashboard';

export default function RecordedCourses() {
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await getCourseByType();

                if (res && res.payload) {
                    setCourses(res?.payload?.courses);
                } else if (res) {
                    setCourses(res);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className={styles.recordedCourses}>
            <CommonCourses title='Recorded Courses' courses={courses?.recorded} loading={loading} />
            <CommonCourses title='live online Courses' courses={courses?.live} loading={loading} />
            <CommonCourses title='In-person Courses' courses={courses?.physical} loading={loading} />
        </div>
    )
}
