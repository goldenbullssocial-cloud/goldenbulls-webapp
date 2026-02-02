import Algobots from '@/modulers/(user-panel)/algobots'
import React, { Suspense } from 'react'
import Loader from '@/components/loader'

export default function page() {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Algobots />
      </Suspense>
    </div>
  )
}
