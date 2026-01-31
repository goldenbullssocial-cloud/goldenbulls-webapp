'use client';
import React, { useEffect, useState } from 'react'
import styles from './blogDetails.module.scss';
import FaqSection from '../home/faqSection';
import SimilarBlogs from './similarBlogs';
import { useSearchParams } from 'next/navigation';
import { getSingleBlog } from '@/services/blog';
import NoData from '@/components/noData';
import LibraryIcon from '@/icons/libraryIcon';

const BlogDetailsImage = '/assets/images/blog-details-banner.png';

export default function BlogDetails() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [blogData, setBlogData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const res = await getSingleBlog(id);

                if (res && res.payload) {
                    setBlogData(res.payload[0]);
                }
            } catch (error) {
                console.error("Failed to fetch blog details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.blogDetailsAlignment}>
                <div className='container-md'>
                    <div className={styles.blogImage} style={{ background: '#1a1a1a', height: '400px', borderRadius: '12px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                    <div className={styles.blogtitle}>
                        <div style={{ background: '#1a1a1a', height: '40px', width: '70%', borderRadius: '8px', marginBottom: '16px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                        <div style={{ background: '#1a1a1a', height: '20px', width: '30%', borderRadius: '8px', animation: 'pulse 1.5s ease-in-out infinite' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!blogData) {
        return (
            <div className={styles.blogDetailsAlignment}>
                <div className='container-md' style={{ padding: '60px 0' }}>
                    <NoData
                        icon={<LibraryIcon />}
                        title="Blog Not Found"
                        description="The blog you're looking for doesn't exist or has been removed."
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.blogDetailsAlignment}>
                <div className='container-md'>
                    <div className={styles.blogImage}>
                        <img src={blogData?.coverImage} alt='BlogDetailsImage' />
                    </div>
                    <div className={styles.blogtitle}>
                        <h2>
                            {blogData?.title || 'Blog Title'}
                        </h2>
                        <div className={styles.twoText}>
                            <p>
                                By {blogData?.name || 'Author'}
                            </p>
                            <ul>
                                <li>
                                    {blogData?.createdAt ? new Date(blogData.createdAt).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : ''}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.tableofContentDetails}>
                <div className='container-md'>
                    <div className={styles.grid}>
                        <div className={styles.griditems}>
                            <div className={styles.box}>
                                <div className={styles.boxHeader}>
                                    <h2>
                                        Table of Contents
                                    </h2>
                                </div>
                                <ol>
                                    {(blogData?.tableOfContent || blogData?.tableOfContents)?.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                        <div className={styles.griditems}>
                            <p>{blogData?.description || ''}</p>
                        </div>
                    </div>
                </div>
            </div>
            <SimilarBlogs />
            <FaqSection />
        </>
    )
}
