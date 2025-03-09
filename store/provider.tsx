'use client'

import React, { useEffect } from 'react'
import { useAppStore } from './index'

interface StoreInitializerProps {
  children: React.ReactNode
}

export default function StoreProvider({ children }: StoreInitializerProps) {
  const { fetchPosts, fetchCasinos } = useAppStore()

  // Initialize store data when the app loads
  useEffect(() => {
    // Pre-fetch the first page of posts and casinos on app load
    fetchPosts()
    fetchCasinos()
  }, [fetchPosts, fetchCasinos])

  return <>{children}</>
} 