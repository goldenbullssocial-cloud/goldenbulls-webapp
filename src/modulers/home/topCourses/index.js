"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./topCourses.module.scss";
import CoursesIcon from "@/icons/coursesIcon";
import CoursesCard from "@/components/coursesCard";
import { getDashboardCourses } from "@/services/dashboard";
import { getCourses } from "@/services/courses";
import { getCookie } from "../../../../cookie";
import DownPrimaryIcon from "@/icons/downPrimaryIcon";
import classNames from "classnames";

export default function TopCourses() {
  const [activeTab, setActiveTab] = React.useState("recorded");
  const [toggle, setToggle] = React.useState(false);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        const params = {
          page: 1,
          limit: 10,
          courseType: activeTab || "recorded",
        };

        let response;
        if (user) {
          response = await getCourses(params);
        } else {
          response = await getDashboardCourses(params);
        }

        if (response && response.payload && response.payload.data) {
          setCourses(response.payload.data);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [user, activeTab]);

  return (
    <div className={styles.topCourses}>
      <div className="container-md">
        <motion.div
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2>Explore our top courses</h2>
        </motion.div>
        <motion.div
          className={styles.tabCenter}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={styles.tabGroup}>
            <button
              className={activeTab === "recorded" ? styles.active : ""}
              onClick={() => setActiveTab("recorded")}
            >
              <span>Recorded Courses</span>
            </button>
            <button
              className={activeTab === "live" ? styles.active : ""}
              onClick={() => setActiveTab("live")}
            >
              <span>Live Online Courses</span>
            </button>
            <button
              className={activeTab === "physical" ? styles.active : ""}
              onClick={() => setActiveTab("physical")}
            >
              <span>In Person Courses</span>
            </button>
          </div>
        </motion.div>
        <div className={styles.mobileDropdown}>
          <div className={styles.relativeDiv}>
            <button>
              <span>
                Recorded Courses
              </span>
              <div className={classNames(styles.icons, toggle ? styles.rotate : "")} onClick={() => setToggle(!toggle)}>
                <DownPrimaryIcon />
              </div>
              <div className={classNames(styles.dropdown, toggle ? styles.show : styles.hide)}>
                <div className={styles.dropdownDesign}>
                  <div className={styles.dropdownSpacing}>
                    <p>Recorded Courses</p>
                    <p>Live Online Courses</p>
                    <p>In Person Courses</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className={styles.grid}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonMeta}>
                      <div className={styles.skeletonIcon} />
                      <div className={styles.skeletonIcon} />
                      <div className={styles.skeletonIcon} />
                    </div>
                  </div>
                  <div className={styles.skeletonButton} />
                </div>
              ))
            ) : courses?.length > 0 ? (
              courses?.map((item) => (
                <CoursesCard
                  key={item?._id}
                  title={item?.CourseName}
                  price={item?.price}
                  author={item?.instructor}
                  duration={item?.hours}
                  level={item?.courseLevel}
                  rating={item?.averageRating ? item?.averageRating : "0.0"}
                  image={item?.courseVideo}
                  location={item?.location || ""}
                  btnLink={`/courses/${item._id}?courseType=${activeTab}`}
                  btnTitle={item?.isPayment ? `Enrolled` : `Enroll Now`}
                  isFree={item?.isFree}
                />
              ))
            ) : (
              <div className={styles.noData}>
                <div className={styles.iconWrapper}>
                  <CoursesIcon />
                </div>
                <h3>No courses available</h3>
                <p>We are currently updating our course list. Please check back later for new content.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {(courses?.length > 0 && !isLoading) && (
          <motion.div
            className={styles.buttonCenter}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link href="/courses">
              <button>
                <span>See All Courses</span>
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
