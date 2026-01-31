"use client";
import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./latestBlog.module.scss";
import Pagination from "@/components/pagination";
import CategoryPopover from "@/components/categoryPopover";
import Link from "next/link";
import { blogsData } from "@/constants";
import DownPrimaryIcon from '@/icons/downPrimaryIcon'
import classNames from 'classnames'
import { getAllBlogCategories, getAllBlogs } from '@/services/blog';
import NoData from "@/components/noData";
import LibraryIcon from "@/icons/libraryIcon";

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
    // opacity: 0,
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
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllBlogCategories();
      if (res && res.payload) {
        setCategories(res.payload.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch blog categories", error);
    }
  };

  const fetchBlogs = async (categoryId = null) => {
    try {
      setBlogsLoading(true);      
      const res = await getAllBlogs(categoryId);
      if (res && res.payload) {
        // Flatten the nested structure: each item has a blogs array
        const allBlogs = (res.payload.data || []).flatMap(item => item.blogs || []);
        setBlogs(allBlogs);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setBlogsLoading(false);
    }
  };

  // Calculate pagination - now using all blogs since filtering is done by API
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
    setToggle(false);
    // Fetch blogs with the selected category
    fetchBlogs(categoryId === "all" ? null : categoryId);
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
            <button onClick={() => setToggle(!toggle)}>
              <span>
                {selectedCategory === "all"
                  ? "All Categories"
                  : categories.find((c) => c._id === selectedCategory)?.name ||
                  "All Categories"}
              </span>
              <div className={classNames(styles.icons, toggle ? styles.rotate : "")}>
                <DownPrimaryIcon />
              </div>
              <div
                className={classNames(
                  styles.dropdown,
                  toggle ? styles.show : styles.hide
                )}
              >
                <div className={styles.dropdownDesign}>
                  <div className={styles.dropdownSpacing}>
                    <p
                      onClick={() => handleCategoryChange("all")}
                      className={classNames({
                        [styles.active]: selectedCategory === "all",
                      })}
                    >
                      All Categories
                    </p>
                    {categories?.map((category, index) => (
                      <p
                        key={index}
                        onClick={() => handleCategoryChange(category._id)}
                        className={classNames({
                          [styles.active]: selectedCategory === category._id,
                        })}
                      >
                        {category.name}
                      </p>
                    ))}
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
          {blogsLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div className={styles.griditems} key={index}>
                <div className={`${styles.cardImage} ${styles.skeleton} ${styles.skeletonImage}`} />
                <div className={styles.details}>
                  <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                  <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                  <div className={styles.twoContentAlignment}>
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "50%" }} />
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%" }} />
                  </div>
                </div>
              </div>
            ))
          ) : currentBlogs?.length > 0 ? (
            currentBlogs.map((blog, index) => (
              <Link key={index} href={`/blog/${blog.slug || blog._id}?id=${blog._id}`}>
                <motion.div className={styles.griditems} variants={cardVariants}>
                  <div className={styles.cardImage}>
                    <img src={blog?.coverImage || '/assets/images/blog-image.png'} alt={blog.title} />
                  </div>

                  <div className={styles.details}>
                    <h3>{blog.title}</h3>
                    <div className={styles.twoContentAlignment}>
                      <span>{blog?.name || 'Admin'}</span>
                      <ul>
                        <li>{blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : " "}</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <NoData
              icon={<LibraryIcon />}
              title="No blogs found"
              description="There are no blogs currently available in this category."
            />
          )}
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
