"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./imageGallery.module.scss";

const ImageGallery = () => {
  // Sample data for 12 images
  const galleryImages = [
    {
      id: 1,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 1",
      title: "Trading Success",
    },
    {
      id: 2,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 2",
      title: "Market Analysis",
    },
    {
      id: 3,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 3",
      title: "Student Achievement",
    },
    {
      id: 4,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 4",
      title: "Expert Guidance",
    },
    {
      id: 5,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 5",
      title: "Live Trading",
    },
    {
      id: 6,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 6",
      title: "Course Completion",
    },
    {
      id: 7,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 7",
      title: "Community Growth",
    },
    {
      id: 8,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 8",
      title: "Market Insights",
    },
    {
      id: 9,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 9",
      title: "Professional Training",
    },
    {
      id: 10,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 10",
      title: "Success Stories",
    },
    {
      id: 11,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 11",
      title: "Trading Strategies",
    },
    {
      id: 12,
      src: "/assets/images/about-us.png",
      alt: "Gallery Image 12",
      title: "Academy Life",
    },
  ];

  return (
    <section className={styles.imageGallerySection}>
      <div className="container-md">
        {/* <motion.div
          className={styles.titleSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={styles.sectionTitle}>Our Gallery</h2>
          <p className={styles.sectionSubtitle}>
            Explore our journey through these captured moments
          </p>
        </motion.div> */}

        <motion.div
          className={styles.imageGrid}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              className={styles.imageItem}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.05,
              }}
              whileHover={{ zIndex: 1 }}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className={styles.galleryImage}
                />
                {/* <div className={styles.imageOverlay}>
                  <span className={styles.imageNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div> */}
              </div>
              <div className={styles.imageTitle}>
                <h3>{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ImageGallery;
