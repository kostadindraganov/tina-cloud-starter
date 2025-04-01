'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery } from '@/tina/__generated__/types';
import { useLayout } from '@/components/layout/layout-context';
import { Section } from '@/components/layout/section';
import { Container } from '@/components/layout/container';
import { components } from '@/components/mdx-components';
import SidebarBanners from '@/components/banners/SidebarBanners';

const titleColorClasses = {
  blue: 'from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500',
  teal: 'from-teal-400 to-teal-600 dark:from-teal-300 dark:to-teal-500',
  green: 'from-green-400 to-green-600',
  red: 'from-red-400 to-red-600',
  pink: 'from-pink-300 to-pink-500',
  purple: 'from-purple-400 to-purple-600 dark:from-purple-300 dark:to-purple-500',
  orange: 'from-orange-300 to-orange-600 dark:from-orange-200 dark:to-orange-500',
  yellow: 'from-yellow-400 to-yellow-500 dark:from-yellow-300 dark:to-yellow-500',
};

interface ClientPostProps {
  data: PostQuery;
  variables: {
    relativePath: string;
  };
  query: string;
}

export default function PostClientPage(props: ClientPostProps) {
  const { theme } = useLayout();
  const { data } = useTina({ ...props });
  const post = data.post;

  const date = new Date(post.date!);
  let formattedDate = '';
  if (!isNaN(date.getTime())) {
    formattedDate = format(date, 'MMM dd, yyyy');
  }

  // Extract path segments for breadcrumbs
  const pathSegments = props.variables.relativePath.split('/');
  const fileName = pathSegments.pop() || '';
  const fileNameWithoutExt = fileName.replace(/\.mdx?$/, '');

  // Extract excerpt from post for subtitle if available
  const subtitle = post.excerpt ? (
    <div className="text-gray-500 mt-2 text-lg mb-8">
      <TinaMarkdown content={post.excerpt} />
    </div>
  ) : null;

  return (
    <div className="flex-1 bg-white">
      <Container className="max-w-7xl mx-auto py-6">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href={pathSegments.length > 0 ? `/posts/${pathSegments.join('/')}` : '/posts'}
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 transition-colors group"
          >
            <svg 
              className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to {pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : 'Posts'}
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            {/* Title and Subtitle */}
            <div className="mb-8 mt-4">
              <h1 
                data-tina-field={tinaField(post, 'title')} 
                className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
              >
                {post.title}
              </h1>
              {subtitle}
            </div>

            {/* Featured Image */}
            {post.heroImg && (
              <div 
                data-tina-field={tinaField(post, 'heroImg')} 
                className="relative aspect-[16/9] w-full mb-6 rounded-lg overflow-hidden"
              >
                <Image
                  src={post.heroImg}
                  alt={post.title}
                  className="object-cover"
                  fill
                  priority
                />
                
                {/* Controls overlay for image */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button className="w-6 h-6 bg-black/60 rounded flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-6 h-6 bg-black/60 rounded flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Author and Date */}
            <div className="flex items-center mb-10 text-sm text-gray-500">
              {post.author && (
                <>
                  <span className="font-medium mr-1">{post.author.name}</span>
                  <span className="mx-2">•</span>
                </>
              )}
              <span>{formattedDate}</span>
            </div>

            {/* Content */}
            <div 
              data-tina-field={tinaField(post, '_body')} 
              className="prose max-w-none"
            >
              <TinaMarkdown
                content={post._body}
                components={{
                  ...components,
                  img: (props) => (
                    <div className="my-6 rounded-lg overflow-hidden">
                      <img {...props} className="w-full" />
                    </div>
                  ),
                }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Link 
                      key={index} 
                      href={`/posts/tag/${tag}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Social Sharing */}
            <div className="mt-8 flex justify-end space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <span className="sr-only">Share on Facebook</span>
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <span className="sr-only">Share on Twitter</span>
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <span className="sr-only">Share on Pinterest</span>
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-1/4 xl:w-1/5 md:w-3/4 shrink-0 mt-20 lg:mt-0">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold mb-6">Sponsored</h3>
              <SidebarBanners maxBanners={2} position="sidebar" className="space-y-8" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
