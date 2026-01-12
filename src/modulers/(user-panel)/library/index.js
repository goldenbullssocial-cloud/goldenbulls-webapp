import React from 'react'
import styles from './library.module.scss';
import SmartLearning from './smartLearning';
import MyCourses from './myCourses';
import MyAlgobots from './myAlgobots';
export default function Library() {
    return (
        <div className={styles.libraryPage}>
            <SmartLearning />
            <MyCourses />
            <MyAlgobots />
        </div>
    )
}
