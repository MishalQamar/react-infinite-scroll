'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { CursorParam, getArticles } from '../queries/getArticle';
import { format } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
  });

  const articles = data?.pages.flatMap((page) => page.list) ?? [];

  const { ref, inView } = useInView({});

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'pending') {
    return (
      <div className="pt-10 sm:pt-16 space-y-6">
        <div className="flex max-w-xl flex-col items-start justify-between gap-y-4 ">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-6 w-[50%] rounded" />
          <div className="space-y-2 mt-2 w-full">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-[95%] rounded" />
          </div>
        </div>
        <div className="flex max-w-xl flex-col items-start justify-between gap-y-4 ">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-6 w-[50%] rounded" />
          <div className="space-y-2 mt-2 w-full">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-[95%] rounded" />
          </div>
        </div>
        <div className="flex max-w-xl flex-col items-start justify-between gap-y-4 ">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-6 w-[50%] rounded" />
          <div className="space-y-2 mt-2 w-full">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-[95%] rounded" />
          </div>
        </div>
        <div className="flex max-w-xl flex-col items-start justify-between gap-y-4 ">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-6 w-[50%] rounded" />
          <div className="space-y-2 mt-2 w-full">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-[95%] rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-10 sm:pt-16">
      {articles.map((article) => (
        <article
          key={article.id}
          className="flex max-w-xl flex-col items-start justify-between"
        >
          <div className="flex items-center gap-x-4 text-xs">
            <time
              dateTime={article.createdAt.toISOString()}
              className="text-gray-500"
            >
              {format(new Date(article.createdAt), 'PPP')}
            </time>
          </div>
          <div className="group relative">
            <h2 className="mt-3 font-semibold text-gray-900">
              <span className="absolute inset-0" />
              {article.title}
            </h2>
            <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">
              {article.teaser}
            </p>
          </div>
        </article>
      ))}
      <div ref={ref}>
        {!hasNextPage && isFetchingNextPage && (
          <p className="text-right text-xs italic">
            No more articles.
          </p>
        )}
      </div>

      <div ref={ref} className="py-4">
        {!hasNextPage && (
          <p className="text-center text-sm text-gray-500 italic">
            You’ve reached the end. No more articles to load.
          </p>
        )}
      </div>
    </div>
  );
};
