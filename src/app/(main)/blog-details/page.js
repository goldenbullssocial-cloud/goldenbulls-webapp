import BlogDetails from '@/modulers/blogDetails'
import React, { Suspense } from 'react'
import Loader from '@/components/loader'

export const metadata = {
    title: "Blog Post - Golden Bulls",
    description: "Read detailed insights and analysis on trading, forex, and cryptocurrency markets.",
    keywords: "trading article, forex analysis, crypto insights, market trends",
};

export default function page() {
    return (
        <div>
            <Suspense fallback={<Loader />}>
                <BlogDetails />
            </Suspense>
        </div>
    )
}
