'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { PostQuery } from '@/tina/__generated__/types';
import { useLayout } from '@/components/layout/layout-context';
import { Container } from '@/components/layout/container';
import { components } from '@/components/mdx-components';
import SidebarBanners from '@/components/banners/SidebarBanners';
import PositionBanner from '@/components/banners/PositionBanner';
import { SocialShare } from '@/components/social';
import ErrorBoundary from '@/components/error-boundary';
import { ImageWithLoading } from '@/components/ui/image-with-loading';

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
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Set URL only after component mounts on client
    setCurrentUrl(window.location.href);
  }, []);

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
    <ErrorBoundary>
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
                  className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2"
                >
                  {post.title}
                </h1>

                <blockquote className='my-6'> {subtitle}</blockquote>
               
              </div>

              <div className="flex items-center mb-10 text-sm text-gray-500">
                {post.author && (
                  <>
                    <span className="font-medium mr-1">{post.author.name}</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                <span>{formattedDate}</span>
              </div>

              {/* Featured Image */}
              {(post.heroImg || post.thumbnail) && (
                <div 
                  data-tina-field={tinaField(post, 'heroImg')} 
                  className="relative aspect-[3/2] w-full mb-6 mt-2 rounded-lg overflow-hidden"
                >
                  <ImageWithLoading
                    src={post.heroImg || post.thumbnail}
                    alt={post.title ? `${post.title} - featured image` : 'Post featured image'}
                    className="object-cover"
                    fill
                    priority
                  />
                   

                  {/* Controls overlay for image - only show on client side */}
                  {currentUrl && (
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
                  )}
                </div>
              )}


              <PositionBanner position="center" />

              {/* Content */}
              <div 
                data-tina-field={tinaField(post, '_body')} 
                className="prose max-w-none text-lg"
              >
                <TinaMarkdown
                  content={post._body}
                  components={{
                    ...components,
                    img: (props: { url: string; caption?: string; alt?: string }) => (
                      <span className="block my-6">
                        <span className="relative block aspect-[4/3] w-full rounded-lg overflow-hidden">
                          {props.url && (
                            <ImageWithLoading
                              src={props.url}
                              alt={props.caption || props.alt || 'Post content image'}
                              className="object-cover"
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                            />
                          )}
                        </span>
                        {props.caption && (
                          <span className="block text-sm text-gray-500 mt-2 text-center italic">
                            {props.caption}
                          </span>
                        )}
                      </span>
                    ),
                  }}
                />
              </div>


              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className='my-12'>
              <PositionBanner position="bottom" />
              </div>

              {/* Social Sharing */}
              <div className="my-8 flex justify-center sm:justify-end">
                <SocialShare 
                  url={currentUrl}
                  title={post.title || ''}
                  iconSize={48}
                  className="justify-end"
                />
              </div>
   
            </div>

            {/* Right Sidebar */}
            <div className="w-full lg:w-1/4 xl:w-1/5 shrink-0 mt-20 lg:mt-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-lg font-semibold mb-6">Sponsored</h3>
                <SidebarBanners maxBanners={2} position="sidebar" className="space-y-8" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </ErrorBoundary>
  );
}
