import type { Article } from '@/services/news';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = article.publishedAt ? format(parseISO(article.publishedAt), 'PPP') : 'Date unavailable';

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg leading-tight">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 group">
            {article.title}
            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-70 transition-opacity duration-200 text-muted-foreground" />
          </a>
        </CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{article.description}</p>
      </CardContent>
      <CardFooter>
        <Badge variant="secondary">{article.source}</Badge>
      </CardFooter>
    </Card>
  );
}
