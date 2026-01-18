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

// Extract props/items that represent news topics visually
function extractNewsProps(headlines: NewsHeadline[]): string[] {
  const props: string[] = [];
  const allText = headlines.map(h => `${h.title} ${h.description}`).join(' ').toLowerCase();

  const propMappings: [RegExp, string[]][] = [
    // Sports
    [/tennis|australian open|grand slam|wimbledon|us open|french open/, ['tennis ball', 'tennis racket']],
    [/football|soccer|premier league|world cup|champions league/, ['football', 'soccer ball']],
    [/basketball|nba/, ['basketball']],
    [/f1|formula 1|racing|grand prix|verstappen|hamilton/, ['toy race car', 'checkered flag']],
    [/golf|pga|masters/, ['golf ball', 'golf club']],
    [/olympics|olympic/, ['olympic rings symbol', 'gold medal']],
    [/cricket/, ['cricket ball', 'cricket bat']],
    [/rugby/, ['rugby ball']],
    [/cycling|tour de france/, ['cycling jersey', 'bike helmet']],
    [/skiing|winter sports/, ['ski goggles', 'ski poles']],

    // Tech
    [/artificial intelligence|chatgpt|openai|llm|machine learning/, ['small robot toy', 'AI circuit board']],
    [/apple|iphone|mac|tim cook/, ['apple logo sticker']],
    [/spacex|nasa|rocket|mars|moon|astronaut/, ['toy rocket', 'astronaut figurine', 'planet model']],
    [/crypto|bitcoin|ethereum/, ['bitcoin coin', 'crypto logo']],
    [/gaming|playstation|xbox|nintendo/, ['game controller']],

    // Politics/World
    [/election|vote|democracy|ballot/, ['voting sticker', 'ballot']],
    [/climate|environment|sustainability|renewable/, ['small plant', 'leaf', 'solar panel model']],
    [/europe|eu|european union/, ['EU flag']],
    [/usa|america|washington|congress/, ['american flag', 'eagle figurine']],
    [/uk|britain|london|parliament/, ['union jack']],

    // Entertainment
    [/movie|film|oscar|cinema|hollywood/, ['film reel', 'movie ticket', 'clapperboard']],
    [/music|concert|album|grammy|spotify/, ['vinyl record', 'guitar pick', 'music notes']],
    [/book|author|novel|bestseller/, ['stack of books']],
    [/art|museum|exhibition|painting/, ['paint palette', 'art brush']],

    // Business/Economy
    [/stock|market|economy|wall street|trading/, ['stock chart', 'dollar bills']],
    [/startup|entrepreneur|venture/, ['startup swag', 'pitch deck']],

    // Food/Lifestyle
    [/coffee|cafe|barista/, ['coffee beans', 'latte art cup']],
    [/wine|vineyard|sommelier/, ['wine bottle', 'wine glass']],
    [/food|restaurant|chef|michelin/, ['chef hat', 'cookbook']],
  ];

  for (const [pattern, items] of propMappings) {
    if (pattern.test(allText)) {
      props.push(...items);
    }
  }

  // Return unique props, limit to 4
  return [...new Set(props)].slice(0, 4);
}

// Theme-specific ways to incorporate news - $PROPS and $HEADLINES get replaced
const NEWS_INTEGRATION: Record<string, { light: string; dark: string }> = {
  january: {
    light: 'creatively incorporate current events into the ski scene: $PROPS visible in snow or attached to ski gear, stickers on helmet or goggles referencing today\'s news',
    dark: 'incorporate current events into cozy chalet scene: newspaper on side table showing ($HEADLINES), $PROPS arranged on mantle or side table',
  },
  february: {
    light: 'incorporate current events into home office: newspaper on desk showing ($HEADLINES), $PROPS on desk or shelves, topical mug or stickers',
    dark: 'incorporate current events into bedroom scene: phone showing news ($HEADLINES), $PROPS on nightstand',
  },
  march: {
    light: 'incorporate current events into running scene: $PROPS along trail or tucked in waistband, running gear with topical designs',
    dark: 'incorporate current events into post-run scene: phone showing news ($HEADLINES), $PROPS scattered in grass nearby',
  },
  april: {
    light: 'incorporate current events into cycling scene: $PROPS in jersey pocket or bike bag, stickers on frame or helmet referencing news',
    dark: 'incorporate current events into roadside scene: phone showing headlines ($HEADLINES) while stuck, $PROPS on ground nearby',
  },
  may: {
    light: 'incorporate current events into picnic scene: newspaper on blanket showing ($HEADLINES), $PROPS scattered on picnic blanket among snacks',
    dark: 'incorporate current events into bench scene: newspaper showing headlines, $PROPS on bench or ground nearby',
  },
  june: {
    light: 'incorporate current events into swimming scene: $PROPS floating nearby or on shore, swim gear with topical designs or text',
    dark: 'incorporate current events into pool float scene: phone showing news ($HEADLINES), $PROPS floating on water or on pool edge',
  },
  july: {
    light: 'incorporate current events into surf scene: $PROPS on beach or in sand, surfboard art referencing current events, beach towels with topical designs',
    dark: 'incorporate current events into beach nap scene: magazine showing headlines ($HEADLINES), $PROPS in sand nearby',
  },
  august: {
    light: 'incorporate current events into motorcycle scene: $PROPS in saddlebag or on overlook, helmet stickers and patches referencing news',
    dark: 'incorporate current events into hammock scene: phone showing news ($HEADLINES), $PROPS hanging nearby or on ground',
  },
  september: {
    light: 'incorporate current events into office scene: newspaper on desk showing ($HEADLINES), $PROPS among plants and desk items, monitor showing news',
    dark: 'incorporate current events into desk sleep scene: monitor showing headlines, $PROPS on messy desk',
  },
  october: {
    light: 'incorporate current events into garage scene: $PROPS on workbench among tools, radio or poster referencing news, topical bumper stickers',
    dark: 'incorporate current events into garage sleep scene: radio playing news ($HEADLINES), $PROPS scattered on floor and workbench',
  },
  november: {
    light: 'incorporate current events into armchair scene: newspaper showing ($HEADLINES), $PROPS on side table or bookshelf, topical book titles',
    dark: 'incorporate current events into sleep scene: newspaper on armchair arm, $PROPS on side table with wine and cheese',
  },
  december: {
    light: 'incorporate current events into christmas scene: TV showing news ($HEADLINES) alongside darts, $PROPS among presents and christmas chaos',
    dark: 'incorporate current events into dinner scene: TV in background showing news, $PROPS on table among feast remains',
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

  // Get top 2-3 headlines shortened
  const topHeadlines = headlines
    .slice(0, 3)
    .map(h => h.title.replace(/["']/g, '').substring(0, 40))
    .join('; ');

  // Extract visual props from all headlines
  const props = extractNewsProps(headlines);
  const propsText = props.length > 0 ? props.join(', ') : 'newspaper, magazine, topical stickers';

  // Get theme-specific integration
  const integration = NEWS_INTEGRATION[month] || {
    light: 'incorporate current events naturally: $PROPS visible in scene, news references ($HEADLINES)',
    dark: 'incorporate current events naturally: $PROPS visible, news showing ($HEADLINES)',
  };

  return {
    light: `, ${integration.light.replace('$HEADLINES', topHeadlines).replace('$PROPS', propsText)}`,
    dark: `, ${integration.dark.replace('$HEADLINES', topHeadlines).replace('$PROPS', propsText)}`,
  };
}
