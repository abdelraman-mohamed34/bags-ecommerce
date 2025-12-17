'use client'

import ProductGrid from '@/_products/ProductGrid'
import { fetchAllProducts } from '@/features/async/productSlice'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Home() {
  const products = useSelector((p) => p.items.products)
  const dispatch = useDispatch()
  const { data: session } = useSession()

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  console.log(products)
  console.log(session?.user)

  return (
    <div>
      <ProductGrid />
    </div>
  )
}

export default Home