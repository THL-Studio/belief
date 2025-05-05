/**
 * Represents a news article.
 */
export interface Article {
  /**
   * The title of the article.
   */
  title: string;
  /**
   * The URL of the article.
   */
  url: string;
  /**
   * The source of the article.
   */
  source: string;
  /**
   * The date the article was published (ISO 8601 format).
   */
  publishedAt: string;
  /**
   * A short description or snippet of the article.
   */
  description: string;
}

/**
 * Asynchronously retrieves news articles from a given source/category.
 *
 * @param category The news category (e.g., 'general', 'technology', 'business').
 * @returns A promise that resolves to an array of Article objects.
 */
export async function getNews(category: string): Promise<Article[]> {
  console.log(`Fetching news for category: ${category}`);
  // TODO: Replace this with a real API call to a news service (e.g., NewsAPI, GNews).
  // Make sure to handle API keys securely (e.g., via environment variables).

  // Simulating API latency
  await new Promise(resolve => setTimeout(resolve, 500));

  // Placeholder data - replace with actual API response parsing
  const placeholderArticles: Article[] = [
    {
      title: 'Breaking News: Major Event Unfolds Downtown',
      url: 'https://example.com/news/breaking-1',
      source: 'City Times',
      publishedAt: '2024-07-28T10:30:00Z',
      description: 'A significant event is currently happening in the city center, causing disruptions. Authorities are on the scene.',
    },
    {
      title: 'Tech Giant Announces Revolutionary New Device',
      url: 'https://example.com/news/tech-giant-1',
      source: 'Tech Today',
      publishedAt: '2024-07-28T09:00:00Z',
      description: 'The long-awaited gadget promises to change the way we interact with technology, featuring cutting-edge AI integration.',
    },
    {
      title: 'Global Markets React to Economic Summit Outcome',
      url: 'https://example.com/news/markets-react-1',
      source: 'Financial Post',
      publishedAt: '2024-07-27T22:15:00Z',
      description: 'Stock markets around the world showed mixed reactions following the conclusion of the international economic summit.',
    },
    {
      title: 'New Study Reveals Surprising Health Benefits of Common Vegetable',
      url: 'https://example.com/news/health-study-1',
      source: 'Wellness Weekly',
      publishedAt: '2024-07-27T18:00:00Z',
      description: 'Researchers have found unexpected positive effects on long-term health associated with regular consumption of broccoli.',
    },
    {
      title: 'Local Sports Team Secures Playoff Spot in Dramatic Finish',
      url: 'https://example.com/news/sports-win-1',
      source: 'Local Gazette',
      publishedAt: '2024-07-27T23:55:00Z',
      description: 'A last-minute goal propelled the home team into the championship playoffs after a nail-biting final game of the season.',
    },
     {
      title: 'Advancements in Renewable Energy Storage Technology',
      url: 'https://example.com/news/renewable-energy-1',
      source: 'Eco Future',
      publishedAt: '2024-07-28T11:00:00Z',
      description: 'A breakthrough in battery technology could significantly improve the efficiency and viability of solar and wind power.',
    },
    {
      title: 'Hollywood Star Set to Direct Upcoming Indie Film',
      url: 'https://example.com/news/hollywood-direct-1',
      source: 'Entertainment Buzz',
      publishedAt: '2024-07-27T15:45:00Z',
      description: 'Known for blockbusters, the acclaimed actor is stepping behind the camera for a passion project focusing on a historical drama.',
    },
     {
      title: 'Travel Industry Sees Surge in Bookings for Autumn Getaways',
      url: 'https://example.com/news/travel-surge-1',
      source: 'Wanderlust Journal',
      publishedAt: '2024-07-28T08:20:00Z',
      description: 'As summer winds down, airlines and hotels report a significant increase in reservations for fall travel destinations.',
    },
  ];

  // Simple filtering based on category for demonstration
  // In a real scenario, the API call would handle category filtering.
  if (category.toLowerCase() === 'technology') {
    return placeholderArticles.filter(a => a.source === 'Tech Today' || a.source === 'Eco Future');
  }
  if (category.toLowerCase() === 'business') {
     return placeholderArticles.filter(a => a.source === 'Financial Post');
  }

  // Return a mix for 'general' or unknown categories
  return placeholderArticles;
}
