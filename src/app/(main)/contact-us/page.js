import ContactUs from '@/modulers/contactUs'
import React from 'react'

export const metadata = {
  title: "Contact Us - Golden Bulls",
  description: "Get in touch with Golden Bulls for inquiries about courses, support, or partnership opportunities.",
  keywords: "contact golden bulls, trading support, course inquiry, customer service",
};

export default function page() {
    return (
        <div>
            <ContactUs />
        </div>
    )
}
