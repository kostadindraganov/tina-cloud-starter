import dynamic from 'next/dynamic'

// Dynamically import the client component
const CasinoSearch = dynamic(() => import('@/components/casino/CasinoSearch'), {
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
    <CasinoSearch
      placeholder={placeholder}
      className={className}
    />
  )
} 