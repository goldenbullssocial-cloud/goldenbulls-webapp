"use client";
import React, { useEffect, useState } from 'react'
import styles from './recorded-courses.module.scss';
import CommonCourses from './commonCourses';

export default function RecordedCourses() {

    return (
        <div className={styles.recordedCourses}>
            <CommonCourses title='Beginner Courses' activeType="recorded" />
            <CommonCourses title='live online Courses' activeType="live" />
            <CommonCourses title='In-person Courses' activeType="physical" />
        </div>
    )
}
