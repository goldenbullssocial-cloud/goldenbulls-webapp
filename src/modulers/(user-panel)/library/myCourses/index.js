"use client";
import React, { useEffect, useState } from 'react'
import styles from './myCourses.module.scss';
import StarIcon from '@/icons/starIcon';
import ClockInIcon from '@/icons/clockInIcon';
import { purchasedAllCourses } from '@/services/dashboard';

const CardImage = '/assets/images/course-user.png';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await purchasedAllCourses({ type: 'course', page: 1, limit: 10 });
        if (res && res.payload) {
          setCourses(res.payload.RECORDED || []);
        }
      } catch (error) {
        console.error("Error fetching my courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className={styles.myCoursesAlignment}>
      <div className={styles.title}>
        <h2>
          My Courses
        </h2>
      </div>
      <div className={styles.grid}>
        {loading ? (
          <p style={{ color: '#fff' }}>Loading courses...</p>
        ) : courses.length > 0 ? (
          courses.map((item, i) => {
            const course = item.courseId;
            return (
              <div className={styles.griditems} key={item._id || i}>
                <div className={styles.cardImage}>
                  <img src={course?.courseVideo || CardImage} alt='CardImage' />
                </div>
                <div className={styles.details}>
                  <h3>
                    {course?.CourseName || 'Untitled Course'}
                  </h3>
                  <div className={styles.listAlignment}>
                    <div className={styles.time}>
                      <ClockInIcon />
                      <span>{course?.hours || '0'} Hours</span>
                    </div>

                    <div className={styles.dotButton}>
                      <div className={styles.dot}></div>
                      <button>
                        <span>{course?.courseLevel || 'Beginner'}</span>
                      </button>
                    </div>

                    <div className={styles.ratingAlignment}>
                      <div className={styles.dot}></div>
                      <div className={styles.rating}>
                        <StarIcon />
                        <span>{course?.rating || '0.0'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.progress}>
                    <div className={styles.active} style={{ width: `${item.percentageCompleted || 0}%` }}></div>
                  </div>
                  <div className={styles.bottomText}>
                    <span>{item.percentageCompleted || 0}% Completed</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <p style={{ color: '#fff' }}>No courses found.</p>
        )}
      </div>
    </div>
  )
}
