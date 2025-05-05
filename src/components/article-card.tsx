import type { Article } from '@/services/news';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Newspaper } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns'; // Import isValid

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  let formattedDate = 'Date unavailable';
  try {
      const parsed = parseISO(article.publishedAt);
      if (isValid(parsed)) {
          formattedDate = format(parsed, 'PPP'); // Format as 'Jul 28, 2024'
      } else {
           console.warn(`Invalid date received for article "${article.title}": ${article.publishedAt}`);
      }
  } catch (e) {
       console.error(`Error formatting date for article "${article.title}": ${article.publishedAt}`, e);
  }


  // Extract potential keywords from title for AI hint
  const titleKeywords = article.title.split(' ').slice(0, 3).join(' ').toLowerCase();
  const imageUrlHint = article.imageUrl && article.imageUrl.includes('picsum')
      ? article.imageUrl.substring(article.imageUrl.lastIndexOf('/') + 1) // Get last part of picsum URL if it exists
      : titleKeywords;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
       {article.imageUrl ? (
        <div className="relative w-full aspect-video">
            <Image
              src={article.imageUrl}
              alt={article.title || 'Article image'}
              fill // Use fill to cover the container
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Define sizes for responsiveness
              className="object-cover" // Ensure image covers the area
              // Pass AI hint based on image URL content or title
              data-ai-hint={imageUrlHint} // Use derived hint
              onError={(e) => {
                // Optional: Handle image loading errors, e.g., show placeholder
                console.error("Image failed to load:", article.imageUrl);
                // You could potentially set a state here to render the placeholder instead
                (e.target as HTMLImageElement).style.display = 'none'; // Hide broken image icon
                // Find parent and show placeholder - More complex logic needed here
              }}
            />
        </div>
       ) : (
         <div className="relative w-full aspect-video bg-muted flex items-center justify-center">
            <Newspaper className="h-16 w-16 text-muted-foreground opacity-50" />
          </div>
       )}
      <CardHeader className="pt-4 pb-2"> {/* Adjusted padding */}
        <CardTitle className="text-lg leading-tight line-clamp-2"> {/* Limit title lines */}
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 group hover:text-primary transition-colors">
            {article.title}
            <ExternalLink className="h-4 w-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground shrink-0" />
          </a>
        </CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-4"> {/* Adjusted padding */}
        <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
      </CardContent>
      <CardFooter className="pt-0 pb-4"> {/* Adjusted padding */}
         {article.source && <Badge variant="secondary">{article.source}</Badge>}
      </CardFooter>
    </Card>
  );
}
