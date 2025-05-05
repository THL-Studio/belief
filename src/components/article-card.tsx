'use client'; // Add this directive

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
import { useState } from 'react'; // Import useState

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false); // State to track image errors
  let formattedDate = 'Date unavailable';

  try {
      // Directly parse the ISO string received from getNews
      const parsed = parseISO(article.publishedAt);
      if (isValid(parsed)) {
          // Check if the date is the fallback epoch date
          if (parsed.getTime() === 0) {
              formattedDate = 'Date unavailable';
              console.warn(`Article "${article.title}" has a fallback date (Epoch).`);
          } else {
              formattedDate = format(parsed, 'PPP'); // Format as 'Jul 28, 2024'
          }
      } else {
           console.warn(`Invalid ISO date string received for article "${article.title}": ${article.publishedAt}`);
      }
  } catch (e) {
       console.error(`Error formatting date for article "${article.title}": ${article.publishedAt}`, e);
  }


  // Extract potential keywords from title for AI hint
  const titleKeywords = article.title.split(' ').slice(0, 3).join(' ').toLowerCase();
  // Use title keywords as hint if image URL is missing or if it's a generic placeholder
  const imageUrlHint = (!article.imageUrl || article.imageUrl.includes('picsum'))
      ? titleKeywords
      : article.source.toLowerCase() || titleKeywords; // Prefer source if available, else title

  const handleImageError = () => {
      console.error("Image failed to load:", article.imageUrl);
      setImageError(true);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
       {(article.imageUrl && !imageError) ? (
        <div className="relative w-full aspect-video">
            <Image
              src={article.imageUrl}
              alt={article.title || 'Article image'}
              fill // Use fill to cover the container
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" // Define sizes for responsiveness
              className="object-cover" // Ensure image covers the area
              data-ai-hint={imageUrlHint} // Use derived hint
              onError={handleImageError} // Use the handler
              priority={
                article.imageUrl.includes(
                  "www.bostonherald.com/wp-content/uploads/2024/05/BHR-Z-EDITORIAL-01_29e509.jpg"
                )
                  ? true : false}
            />
        </div>
       ) : (
         <div className="relative w-full aspect-video bg-muted flex items-center justify-center">
            <Newspaper className="h-16 w-16 text-muted-foreground opacity-50" />
            {/* Optionally add text overlay */}
            {/* <span className="absolute bottom-2 text-xs text-muted-foreground">Image unavailable</span> */}
          </div>
       )}
      <CardHeader className="pt-4 pb-2"> {/* Adjusted padding */}
        <CardTitle className="text-lg leading-tight line-clamp-2"> {/* Limit title lines */}
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 group hover:text-primary transition-colors">
            {article.title}
             {/* Show external link icon only if URL is valid (not '#') */}
            {article.url && article.url !== '#' && (
                <ExternalLink className="h-4 w-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-muted-foreground shrink-0" />
            )}
          </a>
        </CardTitle>
        {/* Show date only if it's not 'Date unavailable' or the epoch fallback */}
        {formattedDate !== 'Date unavailable' && <CardDescription>{formattedDate}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-grow pt-0 pb-4"> {/* Adjusted padding */}
         {/* Ensure description exists before trying to display */}
        {article.description ? (
             <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
        ) : (
             <p className="text-sm text-muted-foreground italic">No description available.</p>
        )}
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex justify-between items-center"> {/* Adjusted padding and layout */}
         {article.source && <Badge variant="secondary">{article.source}</Badge>}
         {/* Optional: Add read more link if needed */}
         {/* <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Read More</a> */}
      </CardFooter>
    </Card>
  );
}
