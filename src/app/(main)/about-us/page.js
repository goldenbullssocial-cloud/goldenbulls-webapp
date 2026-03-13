import AboutUs from '@/modulers/aboutUs'
import React from 'react'

export const metadata = {
    title: "About Us - Golden Bulls 2.0",
    description: "Learn about Golden Bulls 2.0' mission to provide world-class trading education and empower traders worldwide.",
    keywords: "about Golden Bulls 2.0, trading education, forex experts, crypto experts",
};

export default function page() {
    return (
        <div>
            <AboutUs />
        </div>
    )
}
