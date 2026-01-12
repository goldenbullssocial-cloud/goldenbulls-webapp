"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./topCourses.module.scss";
import CoursesIcon from "@/icons/coursesIcon";
import CoursesCard from "@/components/coursesCard";
import { getCourseByType } from "@/services/dashboard";
import DownPrimaryIcon from "@/icons/downPrimaryIcon";
import classNames from "classnames";

export default function TopCourses() {
  const [activeTab, setActiveTab] = React.useState("recorded");
  const [toggle, setToggle] = React.useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourseByType();
        setCourses(response.payload.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

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
              className={activeTab === "inPerson" ? styles.active : ""}
              onClick={() => setActiveTab("inPerson")}
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
            {courses[activeTab]?.length > 0 ? (
              courses[activeTab]?.map((item) => (
                console.log(item, "!!!!item"),

                <CoursesCard
                  key={item?._id}
                  title={item?.CourseName}
                  price={item?.price}
                  author={item?.instructor?.name}
                  duration={item?.hours}
                  level={item?.courseLevel}
                  rating={4.5}
                  image={item?.courseVideo}
                  location={item?.location || ""}
                  btnLink={`/courses/${item._id}`}
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
      </div>
    </div>
  );
}
