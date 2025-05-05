import { getNews, type Article } from '@/services/news';
import { ArticleCard } from '@/components/article-card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default async function Home() {
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    // Fetch news articles - using the placeholder function for now
    articles = await getNews('general'); // Pass a default source or category
  } catch (e) {
    console.error("Failed to fetch news:", e);
    error = "Failed to load news articles. Please try again later.";
  }

  return (
    <div className="space-y-8">
      {/* Removed: <h1 className="text-3xl font-bold tracking-tight">Top Stories</h1> */}

      {error && (
         <Alert variant="destructive">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!error && articles.length === 0 && (
        <p className="text-muted-foreground">No articles found.</p>
      )}

      {!error && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={article.url || index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
