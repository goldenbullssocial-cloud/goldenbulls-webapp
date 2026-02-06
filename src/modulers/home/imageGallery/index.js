"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./imageGallery.module.scss";

const ImageGallery = () => {
  // Sample data for 12 images
  const galleryImages = [
    {
      id: 1,
      src: "/assets/images/GalleryImage1.jpg",
      alt: "Gallery Image 1",
      title: "Stock Trading Excellence",
    },
    {
      id: 2,
      src: "/assets/images/GalleryImage2.jpg",
      alt: "Gallery Image 2",
      title: "Advanced Technical Analysis",
    },
    {
      id: 3,
      src: "/assets/images/GalleryImage3.jpg",
      alt: "Gallery Image 3",
      title: "Trading Success Stories",
    },
    {
      id: 4,
      src: "/assets/images/GalleryImage4.jpg",
      alt: "Gallery Image 4",
      title: "Professional Trading Mentorship",
    },
    {
      id: 5,
      src: "/assets/images/GalleryImage5.jpg",
      alt: "Gallery Image 5",
      title: "Live Trading Sessions",
    },
    {
      id: 6,
      src: "/assets/images/GalleryImage6.jpg",
      alt: "Gallery Image 6",
      title: "Trading Certification Program",
    },
    {
      id: 7,
      src: "/assets/images/GalleryImage7.jpg",
      alt: "Gallery Image 7",
      title: "Trading Community Network",
    },
    {
      id: 8,
      src: "/assets/images/GalleryImage8.jpg",
      alt: "Gallery Image 8",
      title: "Market Research & Analysis",
    },
    {
      id: 9,
      src: "/assets/images/GalleryImage9.jpg",
      alt: "Gallery Image 9",
      title: "Elite Trading Training",
    },
    {
      id: 10,
      src: "/assets/images/GalleryImage10.jpg",
      alt: "Gallery Image 10",
      title: "Trading Achievement Awards",
    },
    {
      id: 11,
      src: "/assets/images/GalleryImage11.jpg",
      alt: "Gallery Image 11",
      title: "Strategic Trading Methods",
    },
    {
      id: 12,
      src: "/assets/images/GalleryImage12.jpg",
      alt: "Gallery Image 12",
      title: "Academy Excellence",
    },
  ];

  return (
    <section className={styles.imageGallerySection}>
      <div className="container-md">
        <motion.div
          className={styles.titleSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={styles.sectionTitle}>Trading Success Gallery</h2>
        </motion.div>

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
