import Courses from '@/modulers/courses'
import React from 'react'

export const metadata = {
  title: "Courses - Golden Bulls",
  description: "Explore our comprehensive trading courses including recorded, live online, and in-person sessions for all skill levels.",
  keywords: "trading courses, forex courses, crypto courses, online trading classes, in-person trading",
};

export default function page() {
    return (
        <div>
            <Courses />
        </div>
    )
}
