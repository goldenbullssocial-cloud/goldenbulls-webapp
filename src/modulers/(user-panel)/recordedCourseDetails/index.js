"use client";
import React, { useEffect, useState } from 'react'
import styles from './recordedCourseDetails.module.scss';
import CourseDetails from './courseDetails';
import CommonCourses from '../recorded-courses/commonCourses';
import { getChapters } from '@/services/dashboard';
import { useSearchParams } from 'next/navigation';

export default function RecordedCourseDetails() {
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
        fetchChaptersData();
    }, [id]);

    return (
        <div className={styles.recordedCourseDetails}>
            <CourseDetails
                selectedVideo={selectedVideo}
                chapters={chapters}
                onVideoSelect={setSelectedVideo}
                onProgressUpdate={fetchChaptersData}
            />
            <CommonCourses title='related courses' activeType={type} excludeCourseId={id} />
        </div>
    )
}
