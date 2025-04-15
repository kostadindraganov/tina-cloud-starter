import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the client component with suspense
const SweepstakesSearch = dynamic(() => import('@/components/sweepstakes/SweepstakesSearch'), {
  ssr: false, // Disable SSR since it's a search component that needs client-side functionality
  loading: () => <div className="w-full h-12 bg-gray-100 animate-pulse rounded-lg"></div>
})

export default function SearchWrapper({ 
  placeholder,
  className 
}: { 
  placeholder?: string
  className?: string 
}) {
  return (
    <Suspense fallback={<div className="w-full h-12 bg-gray-100 animate-pulse rounded-lg"></div>}>
      <SweepstakesSearch
        placeholder={placeholder}
        className={className}
      />
    </Suspense>
  )
} 