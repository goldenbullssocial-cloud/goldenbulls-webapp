import React from 'react'
import ShapingConfident from './shapingConfident'
import Herobanner from './herobanner'
import HeroCard from './heroCard'
import FaqSection from './faqSection'
import ClassroominYourPocket from './classroominYourPocket'
import AutomateTrades from './automateTrades'
import WhatWeOffer from './whatWeOffer'
import TopCourses from './topCourses'
import MarqueeSection from './marqueeSection'
import MeetTheFounder from './meetTheFounder'
import StudentSay from './studentSay'
import JoinChannel from './joinChannel'
import RecognizedSection from './recognizedSection'
import BlogSection from './blogSection'
import GetCertified from './getCertified'
import DownloadApp from '@/components/downloadApp'

export default function HomePage() {
    return (
        <div>
            <Herobanner />
            <HeroCard />
            <ShapingConfident />
            <WhatWeOffer />
            <TopCourses />
            <MarqueeSection />
            <MeetTheFounder />
            <StudentSay />
            <AutomateTrades />
            <JoinChannel />
            <RecognizedSection />
            <BlogSection />
            <GetCertified />
            <ClassroominYourPocket />
            <FaqSection />
            {/* <DownloadApp /> */}
        </div>
    )
}
