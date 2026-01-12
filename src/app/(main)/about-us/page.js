import AboutUs from '@/modulers/aboutUs'
import React from 'react'

export const metadata = {
  title: "About Us - Golden Bulls",
  description: "Learn about Golden Bulls' mission to provide world-class trading education and empower traders worldwide.",
  keywords: "about golden bulls, trading education, forex experts, crypto experts",
};

export default function page() {
    return (
        <div>
            <AboutUs />
        </div>
    )
}
