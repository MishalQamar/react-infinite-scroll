'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { CursorParam, getArticles } from '../queries/getArticle';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export const ArticleList = () => {
  const {
    data,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['articles'],
    queryFn: ({ pageParam }: { pageParam: CursorParam }) =>
      getArticles(pageParam),
    initialPageParam: undefined,
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
    staleTime: 0, // Always fetch fresh data
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  const articles = data?.pages.flatMap((page) => page.list) ?? [];

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '1000px',
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Hide scroll message when all articles are loaded
  useEffect(() => {
    const scrollMessage = document.getElementById('scroll-message');
    if (scrollMessage) {
      if (!hasNextPage && articles.length > 0) {
        scrollMessage.style.display = 'none';
      } else {
        scrollMessage.style.display = 'block';
      }
    }
  }, [hasNextPage, articles.length]);

  if (status === 'pending') {
    return (
      <div className="pt-10 sm:pt-16 space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <Skeleton className="h-48 w-full bg-gray-300" />
            <div className="p-6">
              <Skeleton className="h-4 w-24 rounded bg-gray-300 mb-3" />
              <Skeleton className="h-6 w-[70%] rounded bg-gray-300 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded bg-gray-300" />
                <Skeleton className="h-4 w-[95%] rounded bg-gray-300" />
                <Skeleton className="h-4 w-[80%] rounded bg-gray-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-10 sm:pt-16">
      {articles.map((article) => (
        <article
          key={article.id}
          className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-48 w-full">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-x-4 text-xs mb-3">
              <time
                dateTime={article.createdAt.toISOString()}
                className="text-gray-500"
              >
                {format(new Date(article.createdAt), 'PPP')}
              </time>
            </div>
            <div className="group relative">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {article.teaser}
              </p>
            </div>
          </div>
        </article>
      ))}

      {/* Single intersection observer trigger - positioned earlier for smoother loading */}
      <div ref={ref} className="py-20">
        {/* Debug info - remove in production */}
        <div className="text-center text-xs text-gray-400 mb-4">
          Trigger area - {inView ? 'Visible' : 'Hidden'} | Has next:{' '}
          {hasNextPage ? 'Yes' : 'No'} | Loading:{' '}
          {isFetchingNextPage ? 'Yes' : 'No'}
        </div>
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
    </div>
  );
};
