import React from 'react'
import BlogBanner from './blogBanner'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'
import LatestBlog from './latestBlog'

export default function Blog() {
    return (
        <div>
            <BlogBanner />
            <LatestBlog />
            <ClassroominYourPocket />
            <FaqSection />
        </div>
    )
}
