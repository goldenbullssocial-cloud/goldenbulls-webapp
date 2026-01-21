import RecordedCourseDetails from '@/modulers/(user-panel)/recordedCourseDetails'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <RecordedCourseDetails />

            </Suspense>
        </div>
    )
}
