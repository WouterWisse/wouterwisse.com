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

// Extract visual props that represent news topics - no text, just objects
function extractNewsProps(headlines: NewsHeadline[]): string[] {
  const props: string[] = [];
  const allText = headlines.map(h => `${h.title} ${h.description}`).join(' ').toLowerCase();

  const propMappings: [RegExp, string[]][] = [
    // Sports
    [/tennis|australian open|grand slam|wimbledon|us open|french open/, ['tennis ball', 'tennis racket']],
    [/super bowl|nfl|american football/, ['american football']],
    [/football|soccer|premier league|world cup|champions league/, ['soccer ball']],
    [/basketball|nba/, ['basketball']],
    [/f1|formula 1|grand prix|verstappen|hamilton/, ['toy formula 1 car', 'checkered flag']],
    [/golf|pga|masters/, ['golf ball', 'golf tee']],
    [/olympics|olympic/, ['olympic rings', 'gold medal']],
    [/cricket/, ['cricket ball']],
    [/rugby/, ['rugby ball']],
    [/baseball|mlb/, ['baseball', 'baseball glove']],
    [/hockey|nhl/, ['hockey puck']],
    [/boxing|ufc|mma/, ['boxing gloves']],
    [/skiing|winter sports/, ['mini skis']],
    [/swimming/, ['swimming goggles']],
    [/marathon|running/, ['running shoes', 'race medal']],

    // Countries/Regions (flags, maps, landmarks)
    [/greenland/, ['flag of greenland', 'map of greenland']],
    [/usa|america|united states/, ['american flag', 'statue of liberty miniature']],
    [/uk|britain|england/, ['union jack flag', 'big ben miniature']],
    [/france|paris/, ['french flag', 'eiffel tower miniature']],
    [/germany/, ['german flag']],
    [/china|beijing/, ['chinese flag', 'chinese dragon figurine']],
    [/japan|tokyo/, ['japanese flag', 'lucky cat figurine']],
    [/australia/, ['australian flag', 'kangaroo figurine']],
    [/canada/, ['canadian flag', 'maple leaf']],
    [/netherlands|dutch/, ['dutch flag', 'orange lion', 'tiny windmill']],
    [/europe|eu|european/, ['EU flag']],
    [/russia|moscow/, ['russian nesting doll']],
    [/brazil/, ['brazilian flag']],
    [/india/, ['indian flag']],
    [/mexico/, ['mexican flag', 'sombrero miniature']],

    // Tech
    [/artificial intelligence|chatgpt|openai|ai |robot/, ['small robot toy', 'circuit board']],
    [/apple|iphone|mac/, ['apple logo', 'airpods']],
    [/spacex|nasa|rocket|mars|moon|astronaut|space/, ['toy rocket', 'astronaut figurine', 'moon globe']],
    [/crypto|bitcoin|ethereum/, ['gold bitcoin coin']],
    [/gaming|playstation|xbox|nintendo/, ['game controller']],
    [/drone/, ['small drone']],
    [/electric car|tesla|ev /, ['toy electric car']],

    // Nature/Climate
    [/climate|global warming/, ['small globe', 'thermometer']],
    [/solar|renewable/, ['mini solar panel']],
    [/ocean|marine|whale|dolphin/, ['whale figurine', 'seashell']],
    [/forest|trees|amazon/, ['small tree', 'leaf']],
    [/polar bear|arctic|antarctic/, ['polar bear figurine', 'ice cube']],

    // Entertainment
    [/oscar|academy award|hollywood/, ['oscar statuette', 'film reel']],
    [/grammy|music award/, ['grammy trophy', 'vinyl record']],
    [/concert|tour|band/, ['guitar pick', 'concert ticket stub']],
    [/netflix|streaming/, ['popcorn bucket']],
    [/disney/, ['mickey mouse ears']],

    // Food/Drink
    [/coffee/, ['coffee beans', 'espresso cup']],
    [/wine|champagne/, ['wine bottle', 'wine cork']],
    [/beer|brewery/, ['beer bottle']],
    [/chocolate/, ['chocolate bar']],

    // Finance/Business
    [/stock|wall street|market/, ['bull figurine', 'gold bar']],
    [/bitcoin|crypto/, ['bitcoin coin']],

    // Misc
    [/royal|king|queen|crown/, ['tiny crown']],
    [/wedding|marriage/, ['wedding rings']],
    [/baby|birth/, ['baby bootie']],
    [/dog|puppy/, ['dog toy']],
    [/cat|kitten/, ['cat toy']],
  ];

  for (const [pattern, items] of propMappings) {
    if (pattern.test(allText)) {
      props.push(...items);
    }
  }

  // Return unique props, limit to 4
  return [...new Set(props)].slice(0, 4);
}

export function generateNewsPromptAdditions(
  newsSummary: NewsSummary,
  _month: string
): { light: string; dark: string } {
  const { headlines } = newsSummary;

  if (headlines.length === 0) {
    return { light: '', dark: '' };
  }

  // Extract visual props from headlines
  const props = extractNewsProps(headlines);

  if (props.length === 0) {
    return { light: '', dark: '' };
  }

  const propsText = props.join(', ');

  // Simple prompt - let the AI figure out natural placement
  const addition = `, IMPORTANT: naturally incorporate these props somewhere in the scene to reflect today's news: ${propsText}`;

  return {
    light: addition,
    dark: addition,
  };
}
