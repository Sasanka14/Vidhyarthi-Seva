'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vs-primary to-vs-secondary">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Vidhyarthi Seva</h1>
        <p className="text-xl">Loading...</p>
      </div>
    </div>
  )
} 