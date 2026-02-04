"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./aboutUs.module.scss";

const AboutUs = () => {
  const router = useRouter();

  const handleMoreAboutUs = () => {
    router.push("/about-us");
  };

  return (
    <section className={styles.aboutUsSection}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <motion.div
            className={styles.contentSection}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className={styles.sectionTitle}>Who We Are</h2>
            <p className={styles.description}>
              We have been active in the markets for the last 5 years.
              Everything taught here comes from live market experience, not
              copied strategies or theory-heavy content. The focus is on
              understanding price behavior, managing risk properly, and trading
              with discipline. Through this journey, several traders from our
              academy have grown into mentors and fund managers. This is not
              about fast results — it's about building traders who can survive
              and stay consistent.
            </p>

            <motion.button
              className={styles.moreAboutBtn}
              onClick={handleMoreAboutUs}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Learn More</span>
            </motion.button>
          </motion.div>
          <motion.div
            className={styles.imageSection}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className={styles.mainImage}>
              <img
                src="/assets/images/about-us.png"
                alt="Delta International Team"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
