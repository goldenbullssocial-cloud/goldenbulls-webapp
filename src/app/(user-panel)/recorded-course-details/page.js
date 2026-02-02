import { PreventProvider } from '@/context/PreventContext'
import RecordedCourseDetails from '@/modulers/(user-panel)/recordedCourseDetails'
import React, { Suspense } from 'react'
import Loader from '@/components/loader'

export default function page() {
    return (
        <PreventProvider>
            <div>
                <Suspense fallback={<Loader />}>
                    <RecordedCourseDetails />
                </Suspense>
            </div>
        </PreventProvider>
    )
}
