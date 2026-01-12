import BlogDetails from '@/modulers/blogDetails'
import React from 'react'

export const metadata = {
  title: "Blog Post - Golden Bulls",
  description: "Read detailed insights and analysis on trading, forex, and cryptocurrency markets.",
  keywords: "trading article, forex analysis, crypto insights, market trends",
};

export default function page() {
    return (
        <div>
            <BlogDetails />
        </div>
    )
}
