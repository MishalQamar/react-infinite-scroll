import { ArticleList } from '@/features/article/components/ArticleList';

export default function DashBoard() {
  console.log('🧪 DATABASE_URL:', process.env.DATABASE_URL);
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <header className="bg-white shadow-xs">
        <div>
          <h1 className="text-lg/6 font-semibold text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <ArticleList />
    </div>
  );
}
