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
import { useQuery } from "@apollo/client/react";
import { GET_ALL_BLOG_DATA, GET_BLOG_CATEGORIES } from "@/graphql/getBlogData";
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
  const [blogs, setBlogs] = useState([]);

  const {
    data: blogData,
    loading: blogsLoading
  } = useQuery(GET_ALL_BLOG_DATA);

  useEffect(() => {
    if (blogData) {
      setBlogs(blogData?.blogs_connection?.nodes);
    }
  }, [blogData]);

  /* Fetch Categories */
  const { data: categoryData } = useQuery(GET_BLOG_CATEGORIES);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData.categories);
    }
  }, [categoryData]);

  // Filter blogs by category using state data
  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "all") {
      return blogs;
    }
    return blogs.filter((blog) =>
      blog.categories.some(
        (cat) => cat.slug === selectedCategory
      )
    );
  }, [selectedCategory, blogs]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

  // Handle category change
  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1); // Reset to first page when category changes
    setToggle(false);
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
                  : categories.find((c) => c.slug === selectedCategory)?.name ||
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
                        onClick={() => handleCategoryChange(category.slug)}
                        className={classNames({
                          [styles.active]: selectedCategory === category.slug,
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
              <Link key={index} href={`/blog/${blog.slug}`}>
                <motion.div className={styles.griditems} variants={cardVariants}>
                  <div className={styles.cardImage}>
                    <img src={process.env.NEXT_PUBLIC_NEXT_GRAPHQL_IMAGE_URL + blog?.coverImage?.url} alt={blog.title} />
                  </div>

                  <div className={styles.details}>
                    <h3>{blog.title}</h3>
                    <div className={styles.twoContentAlignment}>
                      <span>{blog?.author?.name}</span>
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
