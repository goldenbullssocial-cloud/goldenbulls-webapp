import React from 'react'
import YouTubeBanner from './youtubeBanner'
import LatestVideos from './latestVideos'
import ClassroominYourPocket from '@/modulers/home/classroominYourPocket'
import FaqSection from '@/modulers/home/faqSection'

export default function YouTube() {
    return (
        <div>
            <YouTubeBanner />
            <LatestVideos />
            <ClassroominYourPocket />
            <FaqSection />
        </div>
    )
}
