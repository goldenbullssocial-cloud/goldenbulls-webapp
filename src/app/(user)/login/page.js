import Login from '@/modulers/(user)/login'
import React, { Suspense } from 'react'

export default function page() {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Login />
            </Suspense>
        </div>
    )
}
