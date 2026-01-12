import React from 'react'
import ContactUsBanner from './contactUsBanner'
import GetInTouch from './getInTouch'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'

export default function ContactUs() {
    return (
        <div>
            <ContactUsBanner />
            <GetInTouch />
            <ClassroominYourPocket />
            <FaqSection />
        </div>
    )
}
