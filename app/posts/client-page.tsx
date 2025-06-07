'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useTina } from 'tinacms/dist/react';
import { PostConnectionQuery, PostConnectionQueryVariables } from '@/tina/__generated__/types';
import { useLayout } from '@/components/layout/layout-context';
import { ArrowRight } from 'lucide-react';
import { ImageWithLoading } from '@/components/ui/image-with-loading';
import client from '@/tina/__generated__/client';

interface ClientPostProps {
  data: PostConnectionQuery;
  variables: PostConnectionQueryVariables;
  query: string;
}

function PostsLoading() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

function PostCard({ post, theme }: { post: any, theme: any }) {
  const formattedDate = post.date ? formatPostDate(post.date) : '';
  const breadcrumbs = post._sys?.breadcrumbs || [];
  const postUrl = `/posts/${breadcrumbs.join('/')}`;
  return (
    <div
      key={post.id}
      className="group flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-lg shadow-sm transition-all duration-150 ease-out hover:shadow-md"
    >
      {(post.heroImg || post.thumbnail) ? (
        <Link href={postUrl}>
          <div className="h-64 min-h-[240px] w-full overflow-hidden relative">
            <ImageWithLoading
              src={post.heroImg || post.thumbnail}
              alt={post.title || 'Post featured image'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
      ) : (
        <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-800"></div>
      )}
      <div className="flex flex-col h-full p-5 line-clamp-3">
        {(post?.author?.name || formattedDate) && (
          <div className="mb-2">
            <p className="text-xs text-grey-500 dark:text-gray-400 text-right">
              {formattedDate || ''}
            </p>
          </div>
        )}
        <Link href={postUrl}>
          <h3 className="text-xl font-semibold mb-3 transition-all duration-150 line-clamp-3 ease-out">
            {post.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-end justify-between">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-start items-center">
              {post.tags.slice(0, 2).map((tag: string | null, index: number) => (
                tag && (
                  <span
                    key={`${post.id}-tag-${index}`}
                    className="px-2 py-1 text-xs font-medium rounded-lg border-[1px] border-green-400 text-grey-500"
                  >
                    {tag}
                  </span>
                )
              ))}
            </div>
          )}
          <Link href={postUrl} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatPostDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) ? format(date, 'dd MMM yyyy') : '';
  } catch {
    return '';
  }
}

const POSTS_PAGE_SIZE = 50;

export default function PostsClientPage(props: ClientPostProps) {
  const { data: initialData } = useTina({ ...props });
  const { theme } = useLayout();
  const [posts, setPosts] = useState(initialData.postConnection.edges || []);
  const [endCursor, setEndCursor] = useState(initialData.postConnection.pageInfo.endCursor);
  const [hasNextPage, setHasNextPage] = useState(initialData.postConnection.pageInfo.hasPreviousPage);
  const [isLoading, setIsLoading] = useState(false);


  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const response = await client.queries.postConnection({
        last: POSTS_PAGE_SIZE,
        ...(endCursor && { before: endCursor }),
        sort: 'date',
        filter: {
          date: { before: new Date().toISOString() },
        },
      });
      const newEdges = response.data.postConnection.edges || [];
      setPosts((prev) => [...prev, ...newEdges]);
      setEndCursor(response.data.postConnection.pageInfo.endCursor);
      setHasNextPage(response.data.postConnection.pageInfo.hasPreviousPage);
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsLoading(false);
    }
  };

  if (!posts.length) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">No posts found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((postData) => {
          if (!postData?.node) return null;
          return <PostCard key={postData.node.id} post={postData.node} theme={theme} />;
        })}
      </div>
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition disabled:opacity-50"
            aria-busy={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      {isLoading && <PostsLoading />}
    </>
  );
}
