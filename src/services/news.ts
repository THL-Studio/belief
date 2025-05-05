import { format, parse, isValid } from 'date-fns'; // Added isValid

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
        // Skip empty lines or lines that only contain whitespace/commas
        if (!line.trim() || line.trim().split(',').every(field => !field.trim())) {
            continue;
        }
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
        // Ensure the row has some content before adding
        if (row.some(field => field.length > 0)) {
          result.push(row);
        }
    }
    // Remove header row if it's the first row and looks like headers (simple check)
    if (result.length > 0 && result[0].some(header => /title|date|image|summary|url|source/i.test(header))) {
       // console.log('Detected and removing header row:', result[0]);
       // return result.slice(1); // Return immediately after removing header
    } else if (result.length > 0) {
        console.warn('CSV header row not detected or first row is likely data:', result[0]);
    }
    return result; // Return all rows if no header detected or empty
}


// Function to safely parse and format date, returning a valid ISO string or throwing an error
function safeFormatDate(dateString: string | undefined, rowIndex: number): string {
  const fallbackDate = new Date(0).toISOString(); // Use epoch as a clearly invalid fallback if needed, or handle differently

  if (!dateString || !dateString.trim()) {
    console.warn(`Missing date in row ${rowIndex + 1}. Using fallback date.`);
    return fallbackDate; // Or throw error if date is mandatory
  }

  const possibleFormats = [
    'M/d/yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd', // Common date formats
    "MM/dd/yy", "M/d/yy",                   // Short year formats
    "yyyy-MM-dd'T'HH:mm:ss.SSSX",           // ISO with timezone
    "yyyy-MM-dd'T'HH:mm:ssX",              // ISO without milliseconds
    "yyyy-MM-dd HH:mm:ss",                 // SQL-like timestamp
    "yyyyMMdd",                            // Basic date YYYYMMDD
    'P HH:mm',                             // Includes time 'Jul 28, 2024 15:30' (adjust 'P' based on actual format)
    'Pp',                                  // Includes time with seconds
    'PPpp',                                // Includes full date and time with seconds
    'yyyy-MM-dd HH:mm'                     // Common format without seconds
    // Add other potential formats from your data
  ];

  let parsedDate: Date | null = null;

  for (const fmt of possibleFormats) {
      try {
          const date = parse(dateString, fmt, new Date());
          if (isValid(date)) {
              parsedDate = date;
              break; // Found a valid format
          }
      } catch (e) {
          // Ignore parsing errors for specific formats and try the next one
      }
  }

  // Try direct parsing as a last resort (handles ISO 8601 and some others)
  if (!parsedDate) {
      const directParsed = new Date(dateString);
      if (isValid(directParsed)) {
          parsedDate = directParsed;
      }
  }


  if (parsedDate && isValid(parsedDate)) {
    return parsedDate.toISOString();
  } else {
    console.error(`Invalid or unparseable date format in row ${rowIndex + 1}: "${dateString}". Using fallback date.`);
    // Decide whether to throw an error or return a fallback
    // throw new Error(`Invalid date format in row ${rowIndex + 1}: "${dateString}"`);
    return fallbackDate; // Return fallback to avoid crashing, but log error
  }
}


/**
 * Asynchronously retrieves news articles from a Google Sheet CSV.
 * Throws an error if fetching or parsing fails.
 *
 * @param category The news category (currently ignored, fetches all).
 * @returns A promise that resolves to an array of Article objects.
 */
export async function getNews(category: string): Promise<Article[]> {
  // Ensure the URL points to the export format
  const csvUrl = 'https://docs.google.com/spreadsheets/d/1Zdv2-P8VGEdgS65mHksjFpPjxWMvqm0SK1E-ZK9xGW4/export?format=csv&gid=0'; // Added gid=0 for the first sheet explicitly
  console.log(`Fetching news from Google Sheet for category: ${category}`); // Log category for context

  try {
    const response = await fetch(csvUrl, {
      // Use cache:'no-store' during development/debugging if needed
      // cache: 'no-store',
      next: { revalidate: 3600 } // Revalidate every hour in production
    });

    if (!response.ok) {
      // Throw a more specific error based on response status
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
    }

    const csvText = await response.text();

    // Check if CSV text is empty or just whitespace
     if (!csvText || !csvText.trim()) {
        console.warn('Received empty or whitespace-only CSV data.');
        return []; // Return empty array if CSV is empty
     }


    const rows = parseCSV(csvText);

    // Check if parsing resulted in rows (parseCSV now handles empty lines)
    if (rows.length <= 1) { // Check if only header or no data rows exist
       console.warn('CSV contains no data rows after parsing.');
       return [];
    }


    // Assuming the first row IS headers based on parseCSV logic modification (it's kept)
    const headerRow = rows[0].map(h => h.toLowerCase().trim()); // Normalize headers
    // Find indices based on header names (more robust than fixed indices)
    const titleIndex = headerRow.indexOf('title');
    const dateIndex = headerRow.indexOf('date');
    const imageIndex = headerRow.indexOf('image url'); // Adjust header name if different
    const summaryIndex = headerRow.indexOf('article summary/content'); // Adjust header name
    const urlIndex = headerRow.indexOf('article url'); // Adjust header name
    const sourceIndex = headerRow.indexOf('source');

    // Validate that all required columns were found
    if ([titleIndex, dateIndex, urlIndex, sourceIndex].some(index => index === -1)) {
      console.error('Could not find all required columns in CSV header:', headerRow);
      // Decide how to handle: throw error or return empty/partial data
      throw new Error('CSV is missing required columns (Title, Date, URL, Source).');
      // return [];
    }


    // Map data rows (starting from index 1)
    const articles: Article[] = rows.slice(1).map((row, rowIndex): Article | null => {
       // Basic validation: Check if essential fields like title and URL have content
       const title = row[titleIndex]?.trim();
       const url = row[urlIndex]?.trim();

       if (!title || !url) {
         console.warn(`Skipping row ${rowIndex + 2} due to missing title or URL:`, row);
         return null; // Skip this row if essential data is missing
       }

       // Check for placeholder URLs or obviously invalid URLs if necessary
        if (url === '#') {
            console.warn(`Skipping row ${rowIndex + 2} due to placeholder URL (#):`, row);
            return null;
        }


      try {
            const publishedAt = safeFormatDate(row[dateIndex]?.trim(), rowIndex + 2); // Pass rowIndex for logging

             return {
                title: title,
                publishedAt: publishedAt,
                imageUrl: row[imageIndex]?.trim() || undefined, // Optional image URL
                description: row[summaryIndex]?.trim() || '', // Optional description
                url: url,
                source: row[sourceIndex]?.trim() || 'Unknown Source', // Source or default
            };
      } catch (dateError: any) {
           console.error(`Error processing row ${rowIndex + 2}: ${dateError.message}`, row);
           return null; // Skip row if date processing fails critically
      }

    }).filter((article): article is Article => article !== null); // Filter out null entries

    console.log(`Successfully fetched and parsed ${articles.length} articles.`);
    return articles;

  } catch (error) {
    console.error('Error in getNews function:', error);
    // Re-throw the error so the Page component can catch it
    throw error;
    // Or: return []; // Depending on desired behavior on error
  }
}
