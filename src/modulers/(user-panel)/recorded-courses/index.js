import React from 'react'
import styles from './recorded-courses.module.scss';
import CommonCourses from './commonCourses';
export default function RecordedCourses() {
    return (
        <div className={styles.recordedCourses}>
            <CommonCourses title='Recorded Courses' />
            <CommonCourses title='live online Courses' />
            <CommonCourses title='In-person Courses' />
        </div>
    )
}
