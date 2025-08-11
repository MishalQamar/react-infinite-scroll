'use server';

import prisma from '@/lib/prisma';

// Cursor type for cursor-based pagination
// This ensures we can efficiently paginate through large datasets
type Cursor = {
  id: string;
  createdAt: number;
};

export type CursorParam = Cursor | undefined;

/**
 * Fetches articles using cursor-based pagination
 * 
 * This implementation uses cursor-based pagination instead of offset pagination
 * for better performance with large datasets. The cursor is based on the
 * combination of createdAt and id to ensure stable ordering.
 * 
 * @param cursor - The cursor from the previous page, undefined for first page
 * @returns Promise containing articles and pagination metadata
 */
export const getArticles = async (cursor: CursorParam) => {
  try {
    const take = 3; // Number of articles per page

    // Fetch one extra article to determine if there are more pages
    let articles = await prisma.article.findMany({
      take: take + 1,
      skip: 1, // Skip the cursor record itself
      cursor: cursor
        ? { 
            id: cursor.id, 
            createdAt: new Date(cursor.createdAt) 
          }
        : undefined,
      orderBy: [
        { createdAt: 'desc' }, // Primary sort by creation date
        { id: 'desc' }          // Secondary sort by ID for stable ordering
      ],
    });

    // Determine if there are more pages available
    const hasNextPage = articles.length > take;
    
    // Remove the extra article if we fetched more than needed
    if (hasNextPage) {
      articles = articles.slice(0, -1);
    }

    // Get the last article to create the next cursor
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
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw new Error('Failed to fetch articles. Please try again.');
  }
};
