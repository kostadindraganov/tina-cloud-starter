'use client'

import React from 'react'
import Link from 'next/link'
import { BsArrowRight } from 'react-icons/bs'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import { useAppStore } from '@/store'
import { useLayout } from '@/components/layout/layout-context'
import MermaidElement from '@/components/mermaid-renderer'

// Title color classes based on theme
const titleColorClasses: Record<string, string> = {
  blue: 'group-hover:text-blue-500',
  teal: 'group-hover:text-teal-500',
  green: 'group-hover:text-green-500',
  red: 'group-hover:text-red-500',
  pink: 'group-hover:text-pink-500',
  purple: 'group-hover:text-purple-500',
  orange: 'group-hover:text-orange-500',
  yellow: 'group-hover:text-yellow-500',
}

export default function PostList() {
  const { posts, postsLoading, postsPagination, fetchPosts } = useAppStore()
  const { theme } = useLayout()
  
  // Handle page change
  const handlePageChange = (page: number) => {
    fetchPosts(page)
  }
  
  if (postsLoading) {
    return <div className="py-10 text-center">Loading posts...</div>
  }
  
  return (
    <div>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/` + post._sys.filename}
          className="group block px-6 sm:px-8 md:px-10 py-10 mb-8 last:mb-0 bg-gray-50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-1000 rounded-md shadow-sm transition-all duration-150 ease-out hover:shadow-md hover:to-gray-50 dark:hover:to-gray-800"
        >
          <h3
            className={`text-gray-700 dark:text-white text-3xl lg:text-4xl font-semibold title-font mb-5 transition-all duration-150 ease-out ${
              theme?.color ? titleColorClasses[theme.color] : ''
            }`}
          >
            {post.title}{" "}
            <span className="inline-block opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              <BsArrowRight className="inline-block h-8 -mt-1 ml-1 w-auto opacity-70" />
            </span>
          </h3>
          {post.excerpt && (
            <div className="prose dark:prose-dark w-full max-w-none mb-5 opacity-70">
              <TinaMarkdown 
                content={post.excerpt}
                components={{
                  mermaid({ value }: { value: string }) {
                    return <MermaidElement value={value} />;
                  }
                }}
              />
            </div>
          )}
          {post.author && (
            <div className="flex items-center">
              {post.author.avatar && (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                By {post.author.name}
              </span>
            </div>
          )}
        </Link>
      ))}
      
      {/* Pagination Controls */}
      {postsPagination && postsPagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(postsPagination.currentPage - 1)}
            disabled={postsPagination.currentPage === 1}
            className={`px-4 py-2 border rounded ${
              postsPagination.currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-blue-500'
            }`}
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          {Array.from({ length: postsPagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border rounded ${
                page === postsPagination.currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          {/* Next Button */}
          <button
            onClick={() => handlePageChange(postsPagination.currentPage + 1)}
            disabled={postsPagination.currentPage === postsPagination.totalPages}
            className={`px-4 py-2 border rounded ${
              postsPagination.currentPage === postsPagination.totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-blue-500'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
} 