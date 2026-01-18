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

// Theme-specific ways to incorporate news naturally into each scene
const NEWS_INTEGRATION: Record<string, { light: string; dark: string }> = {
  january: {
    light: 'sticker on ski helmet or goggles strap referencing "$HEADLINE"',
    dark: 'newspaper on side table beside fireplace with headline "$HEADLINE" visible',
  },
  february: {
    light: 'newspaper on desk or coffee mug with text referencing "$HEADLINE"',
    dark: 'phone on nightstand showing notification about "$HEADLINE"',
  },
  march: {
    light: 'running bib or shirt with creative text referencing "$HEADLINE"',
    dark: 'phone on grass showing news alert "$HEADLINE"',
  },
  april: {
    light: 'water bottle or cycling jersey with sticker referencing "$HEADLINE"',
    dark: 'phone screen showing "$HEADLINE" while googling flat tire fix',
  },
  may: {
    light: 'newspaper on picnic blanket with headline "$HEADLINE"',
    dark: 'newspaper tucked under arm on bench with headline "$HEADLINE" visible',
  },
  june: {
    light: 'swim cap with playful text referencing "$HEADLINE" or banner in background',
    dark: 'phone in hand showing "$HEADLINE" while floating on pool',
  },
  july: {
    light: 'surfboard art or beach banner in background referencing "$HEADLINE"',
    dark: 'magazine on beach towel with headline "$HEADLINE"',
  },
  august: {
    light: 'helmet sticker or motorcycle tank decal referencing "$HEADLINE"',
    dark: 'phone in relaxed hand showing "$HEADLINE"',
  },
  september: {
    light: 'newspaper on desk or second monitor showing headline "$HEADLINE"',
    dark: 'monitor in background showing news headline "$HEADLINE"',
  },
  october: {
    light: 'garage radio or poster on wall referencing "$HEADLINE"',
    dark: 'small radio on workbench playing news about "$HEADLINE"',
  },
  november: {
    light: 'newspaper beside armchair or book spine referencing "$HEADLINE"',
    dark: 'newspaper draped over armchair arm with headline "$HEADLINE"',
  },
  december: {
    light: 'TV showing news about "$HEADLINE" alongside darts championship',
    dark: 'TV in background showing news headline "$HEADLINE"',
  },
};

export function generateNewsPromptAdditions(
  newsSummary: NewsSummary,
  month: string
): { light: string; dark: string } {
  const { headlines } = newsSummary;

  if (headlines.length === 0) {
    return { light: '', dark: '' };
  }

  // Use the top headline directly
  const topHeadline = headlines[0].title
    .replace(/["']/g, '')
    .substring(0, 60);

  // Get theme-specific integration or use a generic fallback
  const integration = NEWS_INTEGRATION[month] || {
    light: 'somewhere in the scene a reference to "$HEADLINE"',
    dark: 'somewhere in the scene a reference to "$HEADLINE"',
  };

  return {
    light: `, ${integration.light.replace('$HEADLINE', topHeadline)}`,
    dark: `, ${integration.dark.replace('$HEADLINE', topHeadline)}`,
  };
}
