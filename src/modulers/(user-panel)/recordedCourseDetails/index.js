import React from 'react'
import styles from './recordedCourseDetails.module.scss';
import CourseDetails from './courseDetails';
import CourseContent from './courseContent';
import CommonCourses from '../recorded-courses/commonCourses';
export default function RecordedCourseDetails() {
    return (
        <div className={styles.recordedCourseDetails}>
            <CourseDetails />
            <CourseContent />
            <CommonCourses title='related courses' />
        </div>
    )
}
