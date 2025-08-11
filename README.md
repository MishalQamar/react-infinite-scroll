# Infinite Scroll Portfolio

A modern, performant infinite scroll implementation showcasing React Query, Intersection Observer, and cursor-based pagination with Prisma.

## 🚀 Live Demo

[Add your deployed URL here]

## ✨ Features

- **Infinite Scroll**: Seamless loading of content as you scroll
- **Cursor-based Pagination**: Efficient pagination for large datasets
- **React Query Integration**: Optimized data fetching and caching
- **Intersection Observer**: Modern scroll detection without performance impact
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Clean, responsive design with loading states
- **Error Handling**: Graceful error states and retry mechanisms
- **Loading States**: Skeleton loaders and progress indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query (TanStack Query)
- **Database**: PostgreSQL with Prisma ORM
- **Scroll Detection**: React Intersection Observer
- **Date Formatting**: date-fns

## 🏗️ Architecture

### Infinite Scroll Implementation

The infinite scroll is implemented using a combination of:

1. **React Query's `useInfiniteQuery`**: Manages data fetching, caching, and pagination state
2. **Intersection Observer**: Detects when the user scrolls near the bottom
3. **Cursor-based Pagination**: Uses database cursors for efficient pagination

### Key Components

- `ArticleList.tsx`: Main component handling infinite scroll logic
- `getArticle.ts`: Server action for fetching articles with cursor pagination
- `page.tsx`: Portfolio showcase page with feature highlights

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm, yarn, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd scroll
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your database connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   DIRECT_URL="postgresql://username:password@localhost:5432/your_database"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 How It Works

### 1. Cursor-based Pagination

Instead of using offset pagination (which can be slow for large datasets), this implementation uses cursor-based pagination:

```typescript
// The cursor contains the last item's ID and timestamp
type Cursor = {
  id: string;
  createdAt: number;
};

// Each query uses the cursor to fetch the next batch
const articles = await prisma.article.findMany({
  take: 3,
  cursor: cursor ? { id: cursor.id, createdAt: new Date(cursor.createdAt) } : undefined,
  orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
});
```

### 2. React Query Integration

The `useInfiniteQuery` hook manages:
- Data fetching and caching
- Pagination state
- Loading and error states
- Automatic background refetching

```typescript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['articles'],
  queryFn: ({ pageParam }) => getArticles(pageParam),
  getNextPageParam: (lastPage) => lastPage.metaData.cursor,
});
```

### 3. Intersection Observer

The scroll detection uses the Intersection Observer API for optimal performance:

```typescript
const { ref, inView } = useInView({
  threshold: 0.1,
  rootMargin: '100px',
});

useEffect(() => {
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
}, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
```

## 🎯 Performance Optimizations

- **Cursor-based pagination**: O(1) performance regardless of dataset size
- **React Query caching**: Reduces unnecessary API calls
- **Intersection Observer**: Efficient scroll detection without scroll event listeners
- **Optimized queries**: Minimal data transfer with precise field selection
- **Background prefetching**: Next page loads before user reaches the bottom
- **Loading states**: Skeleton loaders and progress indicators for better UX

## 🔧 Customization

### Changing Page Size

Modify the `take` parameter in `src/features/article/queries/getArticle.ts`:

```typescript
const take = 5; // Change from 3 to 5 articles per page
```

### Adjusting Scroll Trigger

Modify the Intersection Observer options in `ArticleList.tsx`:

```typescript
const { ref, inView } = useInView({
  threshold: 0.2, // Trigger when 20% visible (default: 0.1)
  rootMargin: '200px', // Start loading 200px before (default: 100px)
});
```

### Styling

The project uses Tailwind CSS. Customize the design by modifying the classes in the components.

## 📊 Database Schema

```prisma
model Article {
  id        String   @id @default(cuid())
  title     String
  teaser    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🧪 Testing

The project includes 100 seeded articles for testing the infinite scroll functionality. You can modify the seed data in `prisma/seed.ts`.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, React Query, and Prisma**
