import ContactUs from '@/modulers/contactUs'
import React from 'react'

export const metadata = {
    title: "Contact Us - Golden Bulls 2.0",
    description: "Get in touch with Golden Bulls 2.0 for inquiries about courses, support, or partnership opportunities.",
    keywords: "contact Golden Bulls 2.0, trading support, course inquiry, customer service",
};

export default function page() {
    return (
        <div>
            <ContactUs />
        </div>
    )
}
