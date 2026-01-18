export interface NewsHeadline {
  title: string;
  description: string;
  source: string;
  publishedAt: string;
}

export interface NewsSummary {
  headlines: NewsHeadline[];
  topics: string[];
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

    // Extract topics/themes from headlines for prompt generation
    const topics = extractTopics(headlines);

    return {
      headlines,
      topics,
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

function extractTopics(headlines: NewsHeadline[]): string[] {
  // Extract themes from headlines, ranked by keyword match count
  const allText = headlines.map(h => `${h.title} ${h.description}`).join(' ').toLowerCase();

  const topicKeywords: Record<string, string[]> = {
    // More specific keywords first, broader ones later
    tech_billionaires: ['musk', 'elon', 'bezos', 'zuckerberg', 'billionaire tech', 'tech ceo'],
    ai_hype: ['artificial intelligence', 'chatgpt', 'openai', 'machine learning', 'generative ai', 'llm', 'large language model'],
    climate_action: ['climate change', 'renewable energy', 'solar power', 'wind power', 'green energy', 'sustainability', 'electric vehicle', 'ev sales', 'carbon emissions'],
    politics: ['trump', 'biden', 'election', 'congress', 'senate', 'white house', 'campaign', 'democrat', 'republican', 'parliament', 'prime minister'],
    crypto: ['bitcoin', 'cryptocurrency', 'blockchain', 'ethereum', 'crypto market'],
    space_race: ['spacex', 'nasa', 'mars mission', 'moon landing', 'rocket launch', 'space station', 'astronaut'],
    big_tech: ['antitrust', 'monopoly', 'tech regulation', 'data privacy', 'silicon valley'],
    labor_wins: ['union', 'strike', 'workers rights', 'labor dispute', 'wage increase', 'organizing'],
    sports: ['australian open', 'tennis', 'grand slam', 'championship', 'olympics', 'world cup', 'super bowl', 'playoff', 'premier league', 'nba', 'nfl', 'football', 'soccer', 'basketball', 'cricket', 'rugby', 'f1', 'formula 1', 'golf', 'pga'],
    absurd_rich: ['yacht', 'mansion', 'luxury', 'private jet', 'billionaire lifestyle'],
  };

  // Count keyword matches for each topic
  const topicScores: { topic: string; score: number }[] = [];

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    const score = keywords.filter(keyword => allText.includes(keyword)).length;
    if (score > 0) {
      topicScores.push({ topic, score });
    }
  }

  // Sort by score descending, return top 3
  return topicScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(t => t.topic);
}

export function generateNewsPromptAdditions(newsSummary: NewsSummary): { light: string; dark: string } {
  const { headlines, topics } = newsSummary;

  if (headlines.length === 0 || topics.length === 0) {
    return { light: '', dark: '' };
  }

  // Create prominent, visible scene elements based on the primary topic
  // These should be large enough to be clearly visible in the final image
  const additions: { light: string; dark: string } = { light: '', dark: '' };

  // Pick the most prominent topic
  const primaryTopic = topics[0];

  switch (primaryTopic) {
    case 'tech_billionaires':
      additions.light = ', large prominent newspaper in scene with bold headline about tech billionaire visible, satirical "Tax The Rich" protest sign leaning against wall';
      additions.dark = ', large satirical poster on wall with caricature mocking tech billionaire ego clearly visible, coffee table book titled "How To Spend A Billion Dollars Badly"';
      break;

    case 'ai_hype':
      additions.light = ', large visible sign or poster reading "AI Will Replace Everyone (Except Prompt Engineers)", robot toy figure on desk';
      additions.dark = ', prominent neon sign on wall reading "HUMANS > ROBOTS", vintage sci-fi robot poster visible';
      break;

    case 'climate_action':
      additions.light = ', large "SAVE THE PLANET" protest banner visible in scene, solar panel model on desk, many green plants everywhere';
      additions.dark = ', prominent Earth Day poster on wall, globe with visible ice caps, environmental books stacked high';
      break;

    case 'politics':
      additions.light = ', large newspaper with bold political headline prominently displayed, "VOTE" poster on wall, political bumper stickers visible';
      additions.dark = ', prominent political campaign poster on wall, stack of newspapers with election coverage, democracy-themed art';
      break;

    case 'crypto':
      additions.light = ', large satirical "TO THE MOON" crypto poster with rocket ship, fake gold bitcoin coin prominently displayed, chart showing volatile line going up and down';
      additions.dark = ', neon "HODL" sign on wall (turned off), abandoned hardware wallet visible, crypto memes printed and pinned to board';
      break;

    case 'space_race':
      additions.light = ', large vintage NASA mission poster prominently displayed, detailed rocket model on desk, astronaut helmet decoration visible';
      additions.dark = ', huge moon poster on wall, telescope prominently positioned by window, star chart visible, space memorabilia collection';
      break;

    case 'big_tech':
      additions.light = ', large "BREAK UP BIG TECH" protest sign visible, multiple competing brand devices arranged ironically, privacy screen on monitor';
      additions.dark = ', prominent vintage "1984" themed poster on wall, old tech devices displayed as museum pieces, antitrust law books';
      break;

    case 'labor_wins':
      additions.light = ', large "UNION STRONG" banner prominently displayed, solidarity fist poster on wall, fair trade certified products visible';
      additions.dark = ', prominent vintage union organizing poster, workers rights themed art on wall, labor history books stacked';
      break;

    case 'sports':
      additions.light = ', large sports championship banner or pennant prominently displayed, team jersey hanging visibly on wall, sports trophy or medal visible, tennis racket or sports equipment in scene';
      additions.dark = ', huge sports team poster on wall, championship memorabilia prominently displayed, game day snacks and drinks visible, sports jersey draped over furniture';
      break;

    case 'absurd_rich':
      additions.light = ', large satirical magazine cover about wealth inequality prominently displayed, "EAT THE RICH" protest sign visible, champagne bottle used as plant holder';
      additions.dark = ', prominent wealth inequality infographic poster on wall, satirical "billionaire tears" collection, economics books about inequality';
      break;

    default:
      additions.light = ', large newspaper with interesting headline prominently visible in scene';
      additions.dark = ', prominent magazine or newspaper visible with current events coverage';
  }

  return additions;
}
