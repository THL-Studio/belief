import { getNews, type Article } from '@/services/news';
import { ArticleCard } from '@/components/article-card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default async function Home() {
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    // Fetch news articles
    console.log("Attempting to fetch news articles...");
    articles = await getNews('general'); // Pass a default source or category
    console.log(`Fetched ${articles.length} articles.`);
  } catch (e: any) { // Catch specific error type if known, else 'any'
    console.error("Failed to fetch news:", e);
    // Provide a more user-friendly error message
    error = `Failed to load news articles. ${e.message || 'Please try again later.'}`;
  }

  return (
    <div className="space-y-8">
      {/* Error Alert */}
      {error && (
         <Alert variant="destructive" className="mt-4"> {/* Added margin top */}
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Loading News</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {/* Loading/No Articles Message */}
      {!error && articles.length === 0 && (
        <div className="text-center py-10">
            <p className="text-muted-foreground">Loading articles or none found...</p>
            {/* Optional: Add a spinner here */}
        </div>
      )}

      {/* Article Grid */}
      {!error && articles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            // Use a more robust key if possible, e.g., article ID if available, otherwise URL + index
            <ArticleCard key={article.url + '-' + index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
