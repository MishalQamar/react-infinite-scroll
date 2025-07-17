'use server';

import prisma from '@/lib/prisma';

type Cursor = {
  id: string;
  createdAt: number;
};

export type CursorParam = Cursor | undefined;
export const getArticles = async (cursor: CursorParam) => {
  const take = 3;

  let articles = await prisma.article.findMany({
    take: take + 1,
    skip: 1,
    cursor: cursor
      ? { id: cursor.id, createdAt: new Date(cursor.createdAt) }
      : undefined,
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
  });
  const hasNextPage = articles.length > take;
  if (hasNextPage) {
    articles = articles.slice(0, -1);
  }

  const lastArticle = articles.at(-1);

  return {
    list: articles,
    metaData: {
      hasNextPage,
      cursor: lastArticle
        ? {
            id: lastArticle.id,
            createdAt: lastArticle.createdAt.valueOf(),
          }
        : undefined,
    },
  };
};
