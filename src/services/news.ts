import { format, parse } from 'date-fns';

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
  publishedAt: string; // Keep as ISO string for consistency if possible, or format later
  /**
   * A short description or snippet of the article.
   */
  description: string;
  /**
  * The URL of the article's featured image. Optional.
  */
  imageUrl?: string;
}

// Basic CSV parser (handles simple quoted fields, might need enhancement for complex CSVs)
function parseCSV(csvText: string): string[][] {
    const lines = csvText.trim().split('\n');
    const result: string[][] = [];
    for (const line of lines) {
        const row: string[] = [];
        let currentField = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"' && nextChar === '"') { // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                row.push(currentField.trim());
                currentField = '';
            } else {
                 // Preserve carriage returns within fields if needed, otherwise handle line breaks appropriately
                if (char !== '\r') {
                  currentField += char;
                }
            }
        }
        row.push(currentField.trim()); // Add last field
        if (row.some(field => field.length > 0)) { // Avoid adding completely empty rows if any
          result.push(row);
        }
    }
    return result;
}

// Function to safely parse and format date, returning a default or null if invalid
function safeFormatDate(dateString: string | undefined): string {
  if (!dateString) {
    return new Date().toISOString(); // Or return 'Date unavailable' or similar string
  }
  try {
    // Attempt to parse assuming a common format like MM/DD/YYYY or YYYY-MM-DD
    // Adjust the parsing format 'MM/dd/yyyy' based on the actual format in your sheet
    const parsedDate = parse(dateString, 'M/d/yyyy', new Date()); // Example format M/D/YYYY
    if (isNaN(parsedDate.getTime())) {
        // Try another common format if the first fails
        const parsedDateISO = parse(dateString, 'yyyy-MM-dd', new Date());
         if (isNaN(parsedDateISO.getTime())) {
            // If still invalid, try direct ISO parsing or return default
            const directParsed = new Date(dateString);
             if (isNaN(directParsed.getTime())) {
               console.warn(`Invalid date format found: ${dateString}. Using current date.`);
               return new Date().toISOString();
             }
             return directParsed.toISOString();
         }
         return parsedDateISO.toISOString();
    }
    return parsedDate.toISOString();
  } catch (e) {
    console.error(`Error parsing date: ${dateString}`, e);
    return new Date().toISOString(); // Fallback to current date/time in ISO format
  }
}


/**
 * Asynchronously retrieves news articles from a Google Sheet CSV.
 *
 * @param category The news category (currently ignored, fetches all).
 * @returns A promise that resolves to an array of Article objects.
 */
export async function getNews(category: string): Promise<Article[]> {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/1Zdv2-P8VGEdgS65mHksjFpPjxWMvqm0SK1E-ZK9xGW4/export?format=csv';
  console.log(`Fetching news from Google Sheet: ${category}`); // Log category for context

  try {
    const response = await fetch(csvUrl, { next: { revalidate: 3600 } }); // Revalidate every hour
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    // Assuming the first row is headers, slice(1) skips it.
    const articles: Article[] = rows.slice(1).map((row): Article | null => {
       // Basic validation: Check if essential fields like title and URL exist
       if (!row[0] || !row[4]) {
         console.warn("Skipping row due to missing title or URL:", row);
         return null; // Skip this row if essential data is missing
       }

      return {
        title: row[0] || 'No Title', // Column A: Title
        publishedAt: safeFormatDate(row[1]), // Column B: Date -> Format to ISO string
        imageUrl: row[2] || undefined, // Column C: Image URL (optional)
        description: row[3] || '', // Column D: Article Summary/Content
        url: row[4] || '#', // Column E: Article URL
        source: row[5] || 'Unknown Source', // Column F: Source
      };
    }).filter((article): article is Article => article !== null); // Filter out null entries

    // TODO: Implement filtering based on 'category' if needed in the future
    // For now, returns all articles regardless of category

    return articles;

  } catch (error) {
    console.error('Error fetching or parsing news from Google Sheet:', error);
    // Return empty array or throw error, depending on desired behavior
    return [];
    // Or: throw new Error('Could not load news data.');
  }
}
