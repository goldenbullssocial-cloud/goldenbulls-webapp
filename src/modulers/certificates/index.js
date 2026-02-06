import React from 'react'
import CertificatesBanner from './certificatesBanner'
import CertificatesMarquee from './certificatesMarquee'
import CertificatesList from './certificatesList'
import ClassroominYourPocket from '../home/classroominYourPocket'
import FaqSection from '../home/faqSection'

export default function Certificates() {
    return (
        <div>
            <CertificatesBanner />
            <CertificatesMarquee />
            <CertificatesList />
            <ClassroominYourPocket />
            <FaqSection />
        </div>
    )
}
