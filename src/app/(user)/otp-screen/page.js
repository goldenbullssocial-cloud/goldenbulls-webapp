import OtpScreen from '@/modulers/(user)/otp-screen'
import React, { Suspense } from 'react'
import Loader from '@/components/loader'

export default function page() {
    return (
        <div>
            <Suspense fallback={<Loader />}>
                <OtpScreen />
            </Suspense>
        </div>
    )
}
