import dynamic from 'next/dynamic'

// Dynamically import the client component
const SweepstakesSearch = dynamic(() => import('@/components/sweepstakes/SweepstakesSearch'), {
  ssr: false // Disable SSR since it's a search component that needs client-side functionality
})

export default function SearchWrapper({ 
  placeholder,
  className 
}: { 
  placeholder?: string
  className?: string 
}) {
  return (
    <SweepstakesSearch
      placeholder={placeholder}
      className={className}
    />
  )
} 