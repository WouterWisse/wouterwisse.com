export interface NewsHeadline {
  title: string;
  description: string;
  source: string;
  publishedAt: string;
}

export interface NewsSummary {
  headlines: NewsHeadline[];
  date: string;
}

export async function fetchTopHeadlines(date: Date, apiKey: string): Promise<NewsSummary> {
  // NewsAPI free tier only allows 'from' parameter up to 1 month ago
  // We'll fetch top headlines from the previous day
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);

  const fromDate = yesterday.toISOString().split('T')[0];
  const toDate = fromDate; // Same day for more relevant results

  // Use 'everything' endpoint for global coverage (US + Europe + worldwide)
  // More diverse than top-headlines which can be US-centric
  const url = new URL('https://newsapi.org/v2/everything');
  url.searchParams.append('apiKey', apiKey);
  url.searchParams.append('language', 'en');
  url.searchParams.append('pageSize', '50'); // Fetch more to filter from (everything endpoint allows more)
  url.searchParams.append('from', fromDate);
  url.searchParams.append('to', toDate);
  url.searchParams.append('sortBy', 'popularity'); // Get most shared/read articles
  // Include major international sources: EU, Dutch, US, and global
  url.searchParams.append('domains', 'bbc.co.uk,theguardian.com,reuters.com,apnews.com,politico.eu,euronews.com,nytimes.com,washingtonpost.com,ft.com,economist.com,volkskrant.nl,nos.nl,nu.nl');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(`NewsAPI returned status: ${data.status}, message: ${data.message}`);
    }

    const allHeadlines: NewsHeadline[] = (data.articles || [])
      .map((article: any) => ({
        title: article.title,
        description: article.description || '',
        source: article.source?.name || 'Unknown',
        publishedAt: article.publishedAt,
      }));

    // Filter out tragic/negative news
    const filteredHeadlines = allHeadlines.filter(isNewsAppropriate);

    // Take top 5 after filtering
    const headlines = filteredHeadlines.slice(0, 5);

    return {
      headlines,
      date: fromDate,
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

function isNewsAppropriate(headline: NewsHeadline): boolean {
  const text = `${headline.title} ${headline.description}`.toLowerCase();

  // Filter out tragic/negative events
  const negativeKeywords = [
    'crash', 'killed', 'dead', 'death', 'dies', 'died', 'fatal', 'tragedy',
    'terror', 'attack', 'shooting', 'murder', 'suicide', 'explosion',
    'disaster', 'hurricane', 'earthquake', 'tsunami', 'flood', 'fire',
    'war', 'casualties', 'bombing', 'violence', 'victim', 'massacre',
    'abuse', 'assault', 'rape', 'kidnap', 'hostage', 'missing person',
    'pandemic', 'outbreak', 'disease outbreak', 'epidemic',
  ];

  // Skip if contains negative keywords
  if (negativeKeywords.some(keyword => text.includes(keyword))) {
    return false;
  }

  return true;
}

export function generateNewsPromptAdditions(
  newsSummary: NewsSummary,
  _month: string
): { light: string; dark: string } {
  const { headlines } = newsSummary;

  if (headlines.length === 0) {
    return { light: '', dark: '' };
  }

  // Get top 3 headline topics (just the key subject, shortened)
  const topics = headlines
    .slice(0, 3)
    .map(h => h.title.replace(/["']/g, '').substring(0, 50))
    .join(', ');

  // Let the AI be creative - just tell it the news topics
  const addition = `, IMPORTANT: creatively incorporate small props, items, or visual references somewhere in the scene that relate to today's news topics: ${topics}. Use objects like balls, flags, figurines, miniatures, or other items that visually represent these topics - no text or writing.`;

  return {
    light: addition,
    dark: addition,
  };
}
