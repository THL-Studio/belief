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
import { ExternalLink, Newspaper } from 'lucide-react'; // Import Newspaper for placeholder
import { format, parseISO } from 'date-fns';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = article.publishedAt ? format(parseISO(article.publishedAt), 'PPP') : 'Date unavailable';

  // Extract potential keywords from title for AI hint
  const titleKeywords = article.title.split(' ').slice(0, 3).join(' ').toLowerCase();

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
              data-ai-hint={article.imageUrl.includes('picsum') ? new URL(article.imageUrl).pathname.split('/').pop() : titleKeywords } // Use last part of picsum URL or title
            />
        </div>
       ) : (
         <div className="relative w-full aspect-video bg-muted flex items-center justify-center">
            <Newspaper className="h-16 w-16 text-muted-foreground opacity-50" />
          </div>
       )}
      <CardHeader className="pt-4"> {/* Reduced top padding */}
        <CardTitle className="text-lg leading-tight">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 group hover:text-primary transition-colors">
            {article.title}
            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground" />
          </a>
        </CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-4"> {/* Reduced bottom padding */}
        <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
      </CardContent>
      <CardFooter className="pt-0"> {/* Removed top padding */}
        <Badge variant="secondary">{article.source}</Badge>
      </CardFooter>
    </Card>
  );
}
