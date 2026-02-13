"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./onDemandCourses.module.scss";
import CoursesCard from "@/components/coursesCard";
import CoursesIcon from "@/icons/coursesIcon";
import NoData from "@/components/noData";
import { getCourses } from "@/services/courses";
import { getDashboardCourses } from "@/services/dashboard";
import { getCookie } from "../../../../cookie";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 1,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function OnDemandCourses({ title, activeType, bgColor = "#0C0C0C", excludeCourseId = null }) {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCookie = getCookie("user");
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData?.firstName || userData?.name || "User");
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const params = {
          page: 1,
          limit: 10,
          courseType: activeType || "recorded",
        };
        let response;
        if (user) {
          response = await getCourses(params);
        } else {
          response = await getDashboardCourses(params);
        }

        if (response && response.payload && response.payload.data) {
          let coursesData = response.payload.data;
          // Filter out the excluded course if excludeCourseId is provided
          if (excludeCourseId) {
            coursesData = coursesData.filter(course => course._id !== excludeCourseId);
          }
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user, activeType, excludeCourseId]);

  return (
    <motion.section
      className={styles.onDemandCourses}
      style={{ background: bgColor }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container-md">
        {/* Title */}
        <motion.div className={styles.title} variants={itemVariants}>
          <div className={styles.text} style={{ background: bgColor }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h2>
          </div>

          {/* Animated line */}
          <motion.div
            className={styles.line}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ originX: 0 }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Cards Grid or No Data */}
        <div className={styles.grid}>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
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
          ) : courses?.length > 0 ? (
            courses?.map((item) => (
              console.log(item, "item"),

              <motion.div key={item._id} variants={itemVariants}>
                <Link href={`/courses/${item._id}`}>
                  <CoursesCard
                    title={item?.CourseName}
                    price={item?.price}
                    author={item.instructor}
                    duration={item?.hours}
                    level={item?.courseLevel}
                    rating={item?.averageRating ? Number(item.averageRating).toFixed(1) : "0.0"}
                    image={item.courseVideo}
                    location={item?.location || ""}
                    btnLink={`/courses/${item._id}?courseType=${activeType}`}
                    btnTitle={item?.isPayment ? "Enrolled" : "Enroll Now"}
                    isFree={item?.isFree}
                  />
                </Link>
              </motion.div>
            ))
          ) : (
            <NoData
              icon={<CoursesIcon />}
              title="No courses found"
              description="There are no courses currently available in this category."
            />
          )}
        </div>
      </div>
    </motion.section>
  );
}
