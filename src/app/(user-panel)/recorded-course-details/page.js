import { PreventProvider } from '@/context/PreventContext'
import RecordedCourseDetails from '@/modulers/(user-panel)/recordedCourseDetails'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <PreventProvider>
            <div>
                <Suspense fallback={<div>Loading...</div>}>
                    <RecordedCourseDetails />
                </Suspense>
            </div>
        </PreventProvider>
    )
}
