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
  // Extract satirizable themes with progressive lens
  const topics: string[] = [];
  const allText = headlines.map(h => `${h.title} ${h.description}`).join(' ').toLowerCase();

  const topicKeywords = {
    // Topics good for satire
    tech_billionaires: ['musk', 'elon', 'bezos', 'zuckerberg', 'billionaire', 'tech ceo', 'twitter'],
    ai_hype: ['ai', 'artificial intelligence', 'chatgpt', 'openai', 'machine learning', 'automation'],
    climate_action: ['climate', 'renewable', 'solar', 'wind power', 'green energy', 'sustainability', 'electric vehicle'],
    politics: ['trump', 'election', 'congress', 'senate', 'vote', 'campaign', 'debate', 'policy'],
    crypto: ['bitcoin', 'crypto', 'blockchain', 'nft', 'ethereum', 'cryptocurrency'],
    space_race: ['spacex', 'nasa', 'mars', 'moon', 'rocket', 'space tourism', 'satellite'],
    big_tech: ['apple', 'google', 'microsoft', 'meta', 'amazon', 'antitrust', 'monopoly'],
    labor_wins: ['union', 'strike', 'workers', 'labor', 'wage', 'organizing'],
    sports: ['championship', 'olympics', 'world cup', 'super bowl', 'playoff'],
    absurd_rich: ['yacht', 'mansion', 'luxury', 'private jet', 'wealth'],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      topics.push(topic);
    }
  }

  return topics.slice(0, 3); // Return top 3 topics
}

export function generateNewsPromptAdditions(newsSummary: NewsSummary): { light: string; dark: string } {
  const { headlines, topics } = newsSummary;

  if (headlines.length === 0 || topics.length === 0) {
    return { light: '', dark: '' };
  }

  // Create clever, satirical props based on topics
  // These are subtle visual gags that mock absurdity without being disrespectful
  const satireProps: { light: string; dark: string } = { light: '', dark: '' };

  // Pick the most prominent topic
  const primaryTopic = topics[0];

  switch (primaryTopic) {
    case 'tech_billionaires':
      satireProps.light = ', small newspaper on desk with oversized cartoon caricature of tech billionaire on front page, coffee mug with text "Tax The Rich" visible';
      satireProps.dark = ', satirical political cartoon poster on wall mocking tech billionaire egos, coffee table book titled "How To Spend A Billion Dollars Badly"';
      break;

    case 'ai_hype':
      satireProps.light = ', satirical sticker on laptop saying "AI Will Replace Everyone (Except Prompt Engineers)", coffee mug with text "Still Smarter Than ChatGPT"';
      satireProps.dark = ', framed poster on wall reading "In AI We Trust (But Verify)", open book titled "How To Survive The Robot Uprising" on side table';
      break;

    case 'climate_action':
      satireProps.light = ', small recycling bin full of Amazon boxes ironically visible, reusable water bottle with "Save The Planet" sticker, solar calculator on desk';
      satireProps.dark = ', framed vintage "Reduce Reuse Recycle" poster on wall, canvas tote bag with environmental slogan draped over chair';
      break;

    case 'politics':
      satireProps.light = ', newspaper with political cartoon visible, coffee mug with democratic donkey logo, voter registration reminder sticky note on monitor';
      satireProps.dark = ', satirical political poster on wall, stack of progressive magazines on side table, "I Voted" sticker collection visible';
      break;

    case 'crypto':
      satireProps.light = ', satirical "Bitcoin To The Moon" poster with eyeroll emoji, newspaper headline about crypto volatility, piggy bank labeled "Real Money" visible';
      satireProps.dark = ', framed joke poster "In Crypto We Trust (JK)", book titled "Understanding Blockchain (Still Confused)", abandoned crypto wallet on shelf gathering dust';
      break;

    case 'space_race':
      satireProps.light = ', vintage NASA poster on wall, newspaper with space mission headline, toy rocket ship on desk, coffee mug with "Space Is Cool Earth Is Cooler"';
      satireProps.dark = ', retro space travel poster, book titled "Why Mars When Earth Needs Fixing", telescope pointed out window at stars';
      break;

    case 'big_tech':
      satireProps.light = ', multiple devices from competing tech companies visible (subtle flex), satirical "Don\'t Be Evil (Unless Profitable)" sticker, privacy-focused browser tabs visible';
      satireProps.dark = ', vintage "Break Up Big Tech" poster, book about antitrust law, old phone collection showing planned obsolescence';
      break;

    case 'labor_wins':
      satireProps.light = ', "Union Strong" sticker on laptop, newspaper with labor victory headline, coffee mug saying "Solidarity Forever", fair trade coffee bag visible';
      satireProps.dark = ', vintage union organizing poster on wall, stack of progressive labor magazines, "Workers Rights Are Human Rights" banner';
      break;

    case 'sports':
      satireProps.light = ', sports newspaper folded to show championship headline, team scarf draped over chair back, coffee mug with local team logo';
      satireProps.dark = ', framed vintage sports poster, sports jersey hanging in background, pennant flag on wall';
      break;

    case 'absurd_rich':
      satireProps.light = ', satirical magazine cover mocking wealth inequality, "Eat The Rich" sticker on water bottle, newspaper article about billionaire excess visible';
      satireProps.dark = ', sarcastic "Billionaire Tears" coffee mug, framed wealth inequality chart on wall, book titled "Why Billionaires Shouldn\'t Exist"';
      break;

    default:
      // Generic progressive vibes
      satireProps.light = ', newspaper with interesting headline folded on desk, coffee from local independent cafe, reusable water bottle';
      satireProps.dark = ', progressive magazine on coffee table, indie bookstore tote bag visible, local newspaper';
  }

  return satireProps;
}
