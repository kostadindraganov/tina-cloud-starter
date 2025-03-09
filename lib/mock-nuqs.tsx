'use client'

import { useState, useEffect, ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock adapter
export function NuqsAdapter({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Type for the setter function
type QuerySetter = (newValue: string | null | ((prev: string) => string)) => void;

// Mock useQueryState hook
export function useQueryState(key: string, options?: { defaultValue?: string }): [string, QuerySetter] {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultValue = options?.defaultValue || ''
  
  // Get current value from URL
  const currentValue = searchParams?.get(key) || defaultValue
  
  // Local state to manage value
  const [value, setValue] = useState(currentValue)
  
  // Update URL when value changes
  const setQueryValue: QuerySetter = (newValue) => {
    // Handle function updates
    if (typeof newValue === 'function') {
      const currentVal = searchParams?.get(key) || defaultValue
      newValue = newValue(currentVal)
    }
    
    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (newValue === null || newValue === '') {
      params.delete(key)
    } else {
      params.set(key, newValue)
    }
    
    // Update URL
    router.push(`?${params.toString()}`)
    
    // Update local state
    setValue(newValue || '')
  }
  
  // Keep local state in sync with URL
  useEffect(() => {
    const newValue = searchParams?.get(key) || defaultValue
    if (newValue !== value) {
      setValue(newValue)
    }
  }, [searchParams, key, defaultValue, value])
  
  return [value, setQueryValue]
} 