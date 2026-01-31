'use client'
import React, { useState, useEffect } from "react";
import styles from './similarBlogs.module.scss';
import { motion } from "framer-motion";
import classNames from 'classnames';
import DownPrimaryIcon from '@/icons/downPrimaryIcon';
import { getAllBlogCategories, getAllBlogs } from '@/services/blog';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NoData from '@/components/noData';
import LibraryIcon from '@/icons/libraryIcon';

const BlogImage = '/assets/images/blog-card.png';

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

export default function SimilarBlogs() {
    const searchParams = useSearchParams();
    const currentBlogId = searchParams.get('id');
    const [toggle, setToggle] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
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
                const allBlogs = res.payload.data?.flatMap(item => item.blogs || []) || [];
                // Filter out the current blog
                const filteredBlogs = allBlogs.filter(blog => blog._id !== currentBlogId);
                setBlogs(filteredBlogs);
            }
        } catch (error) {
            console.error("Failed to fetch blogs", error);
        } finally {
            setBlogsLoading(false);
        }
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setToggle(false);
        fetchBlogs(categoryId === "all" ? null : categoryId);
    };

    // Show only first 4 blogs
    const displayBlogs = blogs.slice(0, 4);

    return (
        <div className={styles.similarBlogs}>
            <div className="container-md">
                <div className={styles.sectionHeaderAlignment}>
                    <div className={styles.title}>
                        <div className={styles.text}>
                            <h2>Latest Blogs</h2>
                        </div>
                    </div>
                    <div className={styles.line}></div>
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
                            <div className={classNames(styles.dropdown, toggle ? styles.show : styles.hide)}>
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

                {/* Grid container animation */}
                <motion.div
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {blogsLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <motion.div key={index} className={styles.griditems} variants={cardVariants}>
                                <div className={styles.cardImage} style={{ background: '#1a1a1a', height: '240px', borderRadius: '12px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                                <div className={styles.details}>
                                    <div style={{ background: '#1a1a1a', height: '24px', width: '100%', borderRadius: '8px', marginBottom: '12px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                                    <div style={{ background: '#1a1a1a', height: '20px', width: '60%', borderRadius: '8px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                                </div>
                            </motion.div>
                        ))
                    ) : displayBlogs.length > 0 ? (
                        displayBlogs.map((blog, index) => (
                            <Link key={index} href={`/blog/${blog.slug || blog._id}?id=${blog._id}`}>
                                <motion.div className={styles.griditems} variants={cardVariants}>
                                    <div className={styles.cardImage}>
                                        <img src={blog?.coverImage || BlogImage} alt={blog.title} />
                                    </div>

                                    <div className={styles.details}>
                                        <h3>{blog?.title}</h3>
                                        <div className={styles.twoContentAlignment}>
                                            <span>{blog?.name || 'Admin'}</span>
                                            <ul>
                                                <li>
                                                    {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }) : ''}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1', padding: '60px 0' }}>
                            <NoData
                                icon={<LibraryIcon />}
                                title="No Similar Blogs"
                                description="No other blogs available at the moment."
                            />
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
