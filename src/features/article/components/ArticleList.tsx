'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { CursorParam, getArticles } from '../queries/getArticle';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ArticleList = () => {
  // Infinite Query Setup
  // This hook manages the infinite scroll data fetching with React Query
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['articles'],
    queryFn: ({ pageParam }: { pageParam: CursorParam }) =>
      getArticles(pageParam),
    initialPageParam: undefined,
    // This function determines if there are more pages to fetch
    getNextPageParam: (lastPage) => {
      const cursor = lastPage.metaData.cursor;
      if (lastPage.metaData.hasNextPage && cursor) {
        return {
          id: cursor.id,
          createdAt: cursor.createdAt,
        };
      }
      return undefined;
    },
    // Optimize performance with these settings
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Flatten all pages into a single array of articles
  const articles = data?.pages.flatMap((page) => page.list) ?? [];

  // Intersection Observer Setup
  // This hook detects when the user scrolls near the bottom of the list
  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '100px', // Start loading 100px before reaching the element
  });

  // Auto-fetch next page when the intersection observer triggers
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Loading State - Show skeleton loaders
  if (status === 'pending') {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Loading Articles...
          </h2>
          <p className="text-gray-600">
            Initializing infinite scroll with React Query
          </p>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center gap-x-4 mb-4">
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <Skeleton className="h-6 w-[70%] rounded mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-[95%] rounded" />
              <Skeleton className="h-4 w-[80%] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Articles
          </h2>
          <p className="text-red-600 mb-4">
            {error?.message ||
              'Failed to load articles. Please try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with stats */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Articles
            </h2>
            <p className="text-gray-600">
              Scroll to load more articles automatically
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Loaded: {articles.length} articles</span>
            {hasNextPage && (
              <span className="text-blue-600">More available</span>
            )}
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-6">
        {articles.map((article, index) => (
          <article
            key={article.id}
            className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-x-4 text-xs mb-3">
              <time
                dateTime={article.createdAt.toISOString()}
                className="text-gray-500"
              >
                {format(new Date(article.createdAt), 'PPP')}
              </time>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">
                Article #{index + 1}
              </span>
            </div>
            <div className="group relative">
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {article.teaser}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Infinite Scroll Trigger Element */}
      <div ref={ref} className="py-8">
        {isFetchingNextPage && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">
                Loading more articles...
              </span>
            </div>
          </div>
        )}

        {!hasNextPage && articles.length > 0 && (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🎉 All Articles Loaded!
              </h3>
              <p className="text-green-600">
                You&apos;ve successfully loaded all {articles.length}{' '}
                articles using infinite scroll.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scroll Progress Indicator */}
      {hasNextPage && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-3">
          <div className="text-xs text-gray-500 mb-1">
            Scroll Progress
          </div>
          <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (articles.length / 100) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {articles.length} / 100 articles
          </div>
        </div>
      )}
    </div>
  );
};
