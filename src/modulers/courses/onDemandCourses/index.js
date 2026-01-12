"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./onDemandCourses.module.scss";
import CoursesCard from "@/components/coursesCard";

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
    opacity: 0,
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

export default function OnDemandCourses({ title, data, bgColor = "#0C0C0C" }) {
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

        {/* Cards Grid */}
        <motion.div className={styles.grid} variants={containerVariants}>
          {console.log(data, "]]]]]]data")
          }
          {data?.map((item) => (
            console.log(item, "===item"),

            <motion.div key={item.id} variants={itemVariants}>
              <Link href={`/courses/${item._id}`}>
                <CoursesCard
                  title={item.CourseName}
                  price={item.price}
                  author={item.instructor?.name}
                  duration={item.hours}
                  level={item.courseLevel}
                  rating={3.5}
                  image={item.courseVideo}
                  location={item?.location || ""}
                  btnLink={`/courses/${item._id}`}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
