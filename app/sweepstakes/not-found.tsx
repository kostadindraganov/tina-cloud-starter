import Link from 'next/link'
import Layout from '@/components/layout/layout'

export default function SweepstakesNotFound() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Sweepstakes Page Not Found</h2>
        <p className="mb-8">Sorry, the sweepstakes page you are looking for does not exist or has been removed.</p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/sweepstakes"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Sweepstakes Pages
          </Link>
          <Link 
            href="/"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </Layout>
  )
} 