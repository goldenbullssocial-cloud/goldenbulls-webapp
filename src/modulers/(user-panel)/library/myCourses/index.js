import React from 'react'
import styles from './myCourses.module.scss';
import StarIcon from '@/icons/starIcon';
import ClockInIcon from '@/icons/clockInIcon';
const CardImage = '/assets/images/course-user.png';
const ClockIcon = "/assets/icons/calender-icon.png";

export default function MyCourses() {
  return (
    <div className={styles.myCoursesAlignment}>
      <div className={styles.title}>
        <h2>
          My Courses
        </h2>
      </div>
      <div className={styles.grid}>
        {
          [...Array(4)].map((_, i) => {
            return (
              <div className={styles.griditems} key={i}>
                <div className={styles.cardImage}>
                  <img src={CardImage} alt='CardImage' />
                </div>
                <div className={styles.details}>
                  <h3>
                    Forex trading mastferclass for absolute beginners, and market enthusiasts
                  </h3>
                  <div className={styles.listAlignment}>
                    <div className={styles.time}>
                      <ClockInIcon />
                      <span>12 Hours</span>
                    </div>

                    <div className={styles.dotButton}>
                      <div className={styles.dot}></div>
                      <button>
                        <span>Beginner</span>
                      </button>
                    </div>

                    <div className={styles.ratingAlignment}>
                      <div className={styles.dot}></div>
                      <div className={styles.rating}>
                        <StarIcon />
                        <span>4.5</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.progress}>
                    <div className={styles.active}></div>
                  </div>
                  <div className={styles.bottomText}>
                    <span>14% Completed</span>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
