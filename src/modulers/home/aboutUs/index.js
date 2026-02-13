"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./aboutUs.module.scss";

const aboutUsImages = [
  "/assets/images/GalleryImage7.jpg",
  "/assets/images/GalleryImage4.jpg",
  "/assets/images/GalleryImage10.jpg",
];

const AboutUs = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Auto-transition to next image every 3 seconds
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % aboutUsImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleMoreAboutUs = () => {
    router.push("/about-us");
  };

  return (
    <section className={styles.aboutUsSection}>
      <div className="container-md">
        <div className={styles.grid}>
          <div className={styles.griditems}>
            <h2>Who we are</h2>
            <p>
              We have been active in the markets for the last 5 years.
              Everything taught here comes from live market experience, not
              copied strategies or theory-heavy content. The focus is on
              understanding price behavior, managing risk properly, and trading
              with discipline. Through this journey, several traders from our
              academy have grown into mentors and fund managers. This is not
              about fast results — it’s about building traders who can survive
              and stay consistent.
            </p>
            <div className={styles.buttonDesign}>
              <button onClick={handleMoreAboutUs}>
                <span>Learn More</span>
              </button>
            </div>
          </div>
          <div className={styles.griditems}>
            <div className={styles.imageGallery}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  className={styles.image}
                  initial={{ opacity: 0, scale: 0.8, x: 100 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -100 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={aboutUsImages[currentImageIndex]}
                    alt={`About us image ${currentImageIndex + 1}`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
