import Blog from '@/modulers/blog'
import React from 'react'

export const metadata = {
    title: "Blog - Golden Bulls 2.0",
    description: "Read the latest insights, trading tips, market analysis, and educational content from Golden Bulls 2.0 experts.",
    keywords: "trading blog, forex tips, crypto news, market analysis, trading strategies",
};

export default function page() {
    return (
        <div>
            <Blog />
        </div>
    )
}
