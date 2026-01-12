"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./latestBlog.module.scss";
import Pagination from "@/components/pagination";
import CategoryPopover from "@/components/categoryPopover";
import Link from "next/link";
import { blogsData } from "@/constants";
import DownPrimaryIcon from '@/icons/downPrimaryIcon'
import classNames from 'classnames'
const ITEMS_PER_PAGE = 12;

/* Container animation */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

/* Card animation */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function LatestBlog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toggle, setToggle] = React.useState(false);
  // Filter blogs by category
  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "all") {
      return blogsData;
    }
    return blogsData.filter(
      (blog) =>
        blog.category.toLowerCase().replace(" ", "-") === selectedCategory
    );
  }, [selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.latestBlog}>
      <div className="container-md">
        <div className={styles.sectionHeaderAlignment}>
          <div className={styles.title}>
            <div className={styles.text}>
              <h2>Latest Blogs</h2>
            </div>
          </div>
          <div className={styles.line}></div>
          {/* <div className={styles.buttonAlignent}>
            <CategoryPopover
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div> */}
          <div className={styles.relativeDiv}>
            <button>
              <span>
                All Categories
              </span>
              <div className={classNames(styles.icons, toggle ? styles.rotate : "")} onClick={() => setToggle(!toggle)}>
                <DownPrimaryIcon />
              </div>
              <div className={classNames(styles.dropdown, toggle ? styles.show : styles.hide)}>
                <div className={styles.dropdownDesign}>
                  <div className={styles.dropdownSpacing}>
                    <p>All Categories</p>
                    <p>All Categories</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 👇 Grid container animation */}
        <motion.div
          key={`${selectedCategory}-${currentPage}`}
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {currentBlogs.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`}>
              <motion.div className={styles.griditems} variants={cardVariants}>
                <div className={styles.cardImage}>
                  <img src={blog.image} alt={blog.alt} />
                </div>

                <div className={styles.details}>
                  <h3>{blog.title}</h3>
                  <div className={styles.twoContentAlignment}>
                    <span>{blog.author}</span>
                    <ul>
                      <li>{blog.dateLabel}</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {totalPages > 1 && (
          <div className={styles.paginationTopAlignment}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
