import React, { Suspense } from 'react'
import ProductPage from './Deatails'

function page() {
    return (
        <Suspense fallback='...يتم التحميل'>
            <ProductPage />
        </Suspense>
    )
}

export default page
