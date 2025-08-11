'use client';

import { useState } from 'react';

interface TechDemoProps {
  title: string;
  description: string;
  code: string;
}

export const TechDemo = ({
  title,
  description,
  code,
}: TechDemoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 text-left text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors"
        >
          {isExpanded ? 'Hide Code' : 'Show Implementation'}
        </button>
        {isExpanded && (
          <div className="border-t bg-gray-50 p-4">
            <pre className="text-xs text-gray-800 overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export const ImplementationShowcase = () => {
  const implementations = [
    {
      title: 'React Query Setup',
      description:
        'Infinite query configuration with cursor-based pagination',
      code: `const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['articles'],
  queryFn: ({ pageParam }) => getArticles(pageParam),
  getNextPageParam: (lastPage) => lastPage.metaData.cursor,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
});`,
    },
    {
      title: 'Intersection Observer',
      description: 'Scroll detection for triggering next page load',
      code: `const { ref, inView } = useInView({
  threshold: 0.1,
  rootMargin: '100px',
});

useEffect(() => {
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
}, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);`,
    },
    {
      title: 'Cursor Pagination Query',
      description: 'Database query using cursor-based pagination',
      code: `const articles = await prisma.article.findMany({
  take: take + 1,
  skip: 1,
  cursor: cursor ? { 
    id: cursor.id, 
    createdAt: new Date(cursor.createdAt) 
  } : undefined,
  orderBy: [
    { createdAt: 'desc' },
    { id: 'desc' }
  ],
});`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Technical Implementation
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore the key code snippets that power this infinite
          scroll implementation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {implementations.map((impl, index) => (
          <TechDemo
            key={index}
            title={impl.title}
            description={impl.description}
            code={impl.code}
          />
        ))}
      </div>
    </div>
  );
};
