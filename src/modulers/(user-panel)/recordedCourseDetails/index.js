"use client";
import React, { useEffect, useState } from 'react'
import styles from './recordedCourseDetails.module.scss';
import CourseDetails from './courseDetails';
import CourseContent from './courseContent';
import CommonCourses from '../recorded-courses/commonCourses';
import { getCourseByType, getChapters } from '@/services/dashboard';
import { useSearchParams } from 'next/navigation';

export default function RecordedCourseDetails() {
    const [courses, setCourses] = useState(null);
    const [chapters, setChapters] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    const fetchChaptersData = async () => {
        if (!id) return;
        try {
            const response = await getChapters(id);
            const data = response?.payload?.data || (Array.isArray(response?.payload) ? response.payload : (Array.isArray(response) ? response : []));
            setChapters(data);
            return data;
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    };

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
        fetchChaptersData();
    }, [id]);

    const filteredCourses = courses?.[type]?.filter(item => item._id !== id) || [];

    return (
        <div className={styles.recordedCourseDetails}>
            <CourseDetails
                selectedVideo={selectedVideo}
                onProgressUpdate={fetchChaptersData}
            />
            <CourseContent
                onVideoSelect={setSelectedVideo}
                chapters={chapters}
                onChaptersLoaded={setChapters}
            />
            <CommonCourses title='related courses' courses={filteredCourses} />
        </div>
    )
}
