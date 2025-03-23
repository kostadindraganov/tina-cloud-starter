import Link from 'next/link'
import Layout from '@/components/layout/layout'

export default function NotFound() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Page Not Found</h2>
        <p className="mb-8">Sorry, the page you are looking for does not exist.</p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </Layout>
  )
}