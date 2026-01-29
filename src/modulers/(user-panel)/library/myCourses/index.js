"use client";
import React, { useEffect, useState } from 'react'
import styles from './myCourses.module.scss';
import StarIcon from '@/icons/starIcon';
import ClockInIcon from '@/icons/clockInIcon';
import { purchasedAllCourses } from '@/services/dashboard';
import CoursesIcon from '@/icons/coursesIcon';
import classNames from 'classnames';
import NoData from '@/components/noData';
import { useRouter } from 'next/navigation';

const CardImage = '/assets/images/course-user.png';

export default function MyCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await purchasedAllCourses({ page: 1, limit: 10 });
        if (res && res.payload) {
          const allCourses = [
            ...(res.payload.RECORDED || []).map(item => ({ ...item, type: 'recorded' })),
            ...(res.payload.LIVE || []).map(item => ({ ...item, type: 'live' })),
            ...(res.payload.PHYSICAL || []).map(item => ({ ...item, type: 'physical' }))
          ];
          setCourses(allCourses);
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
          Array.from({ length: 4 }).map((_, index) => (
            <div className={styles.griditems} key={index}>
              <div className={`${styles.cardImage} ${styles.skeleton} ${styles.skeletonImage}`} />

              <div className={styles.details}>
                <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />

                <div className={styles.secContent}>
                  <div
                    className={`${styles.skeleton} ${styles.skeletonText}`}
                    style={{ width: "40%" }}
                  />
                  <div
                    className={`${styles.skeleton} ${styles.skeletonText}`}
                    style={{ width: "50%" }}
                  />
                </div>

                <div className={styles.listAlignment}>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%" }} />
                  <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%" }} />
                  <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%" }} />
                </div>

                <div className={styles.buttonDesign}>
                  <div className={`${styles.skeleton} ${styles.skeletonButton}`} />
                </div>
              </div>
            </div>
          ))
        ) : courses.length > 0 ? (
          courses.map((item, i) => {
            const course = item.courseId;
            const tracking = course?.tracking || [];
            const totalPercentage = tracking.reduce((sum, track) => sum + parseFloat(track.percentage || 0), 0);
            const averagePercentage = tracking.length > 0 ? Math.round(totalPercentage / tracking.length) : 0;

            return (
              <div
                className={classNames(styles.griditems, styles.clickable)}
                key={item._id || i}
                onClick={() => router.push(`/recorded-course-details?id=${course?._id}&type=${item.type}`)}
              >
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
                        <span>{course?.rating?.average || '0.0'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.progress}>
                    <div className={styles.active} style={{ width: `${averagePercentage}%` }}></div>
                  </div>
                  <div className={styles.bottomText}>
                    <span>{averagePercentage}% Completed</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <NoData
            icon={<CoursesIcon />}
            title="No courses found"
            description="There are no courses currently available in this category."
          />
        )}
      </div>
    </div>
  )
}
