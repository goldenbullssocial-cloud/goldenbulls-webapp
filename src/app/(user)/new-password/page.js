import NewPassword from '@/modulers/(user)/new-password'
import React, { Suspense } from 'react'
import Loader from '@/components/loader'

export default function page() {
    return (
        <div>
            <Suspense fallback={<Loader />}>
                <NewPassword />
            </Suspense>
        </div>
    )
}
