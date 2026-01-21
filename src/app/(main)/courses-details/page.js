import CoursesDetails from '@/modulers/coursesDetails'
import React, { Suspense } from 'react';

export default function page() {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <CoursesDetails />
            </Suspense>
        </div>
    )
}


