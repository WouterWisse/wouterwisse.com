# Daily News-Based Image Generation

This feature automatically generates daily hero images that incorporate current world news events into the monthly themed images.

## How It Works

1. Every day at 00:00 UTC, a GitHub Action runs
2. It fetches the top news headlines from the previous day using NewsAPI
3. It extracts themes/topics from the headlines (e.g., technology, sports, climate, politics)
4. It generates two images (light and dark mode) with subtle news-related props and details
5. Images are saved in the monthly folder with date-based naming: `YYYY-MM-DD-light.png` and `YYYY-MM-DD-dark.png`
6. The workflow commits and pushes the new images automatically

## Setup Instructions

### 1. Get a NewsAPI Key

1. Visit [newsapi.org](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Free tier includes: 100 requests/day (you only need 1/day)

### 2. Add Secrets to GitHub

Go to your repository settings → Secrets and variables → Actions → Repository secrets

Add the following secrets:

- `NEWS_API_KEY`: Your NewsAPI key
- `REPLICATE_API_TOKEN`: Your Replicate API token (should already exist)

### 3. Configure Character Reference (Optional)

If you want to use a custom character reference image:

1. Go to Settings → Secrets and variables → Actions → Variables
2. Add a repository variable:
   - Name: `CHARACTER_REF`
   - Value: URL to your character reference image

If not set, it will use the default reference image from the repository.

### 4. Enable GitHub Actions

1. Go to repository Settings → Actions → General
2. Under "Workflow permissions", select "Read and write permissions"
3. Save

## Manual Usage

You can also generate daily images manually:

```bash
# Generate images for today
npm run generate:daily

# Dry run (preview without generating)
npm run generate:daily -- --dry-run

# Generate for a specific date
npm run generate:daily -- --date=2026-01-15
```

## Testing the Workflow

You can manually trigger the workflow:

1. Go to Actions tab in GitHub
2. Select "Generate Daily Images" workflow
3. Click "Run workflow"
4. Choose the branch and run

## File Structure

Generated images are saved to:

```
public/images/themes/
  january/
    2026-01-15-light.png
    2026-01-15-dark.png
    2026-01-16-light.png
    2026-01-16-dark.png
    ...
  february/
    ...
```

## How News is Incorporated

The script intelligently filters and satirizes news with a progressive, witty lens:

### Smart Filtering
- **Filters out tragic events**: No crashes, disasters, deaths, violence, or negative news
- **Focuses on satirizable topics**: Tech billionaires, AI hype, climate action, politics, crypto, etc.
- **Fetches 20 headlines but filters to find 5 appropriate ones**

### Clever Visual Satire
Based on detected topics, subtle props are added:

- **Tech billionaires** → "Tax The Rich" coffee mug, satirical cartoon
- **AI hype** → "Still Smarter Than ChatGPT" mug, laptop stickers mocking AI
- **Climate action** → Recycling bin full of Amazon boxes (ironic), "Save The Planet" stickers
- **Politics** → Democratic donkey mug, voter registration reminders, "I Voted" stickers
- **Crypto** → "In Crypto We Trust (JK)" poster, piggy bank labeled "Real Money"
- **Space race** → "Space Is Cool Earth Is Cooler" mug, book "Why Mars When Earth Needs Fixing"
- **Big tech** → "Don't Be Evil (Unless Profitable)" sticker, antitrust books
- **Labor wins** → "Union Strong" stickers, "Solidarity Forever" mug
- **Absurd wealth** → "Eat The Rich" stickers, "Billionaire Tears" mug

The satire is witty and progressive without being disrespectful or tragic.

## Cost Considerations

- NewsAPI: Free (100 requests/day, you use 1)
- Replicate: ~$0.04 per image × 2 images/day = ~$2.40/month
- GitHub Actions: Free for public repos, 2000 minutes/month for private
- Storage: ~2MB/day × 365 days = ~730MB/year

## Customization

### Adjust News Sources

Edit `scripts/fetch-news.ts` to modify:
- Number of headlines fetched
- Language preference
- Date range
- Topic extraction keywords

### Modify Prompt Style

Edit `scripts/generate-daily-images.ts` to customize:
- Base prompts for light/dark mode
- How news is incorporated into scenes
- Character positioning and style

### Change Schedule

Edit `.github/workflows/daily-images.yml`:

```yaml
schedule:
  # Run at different time (example: 6 AM UTC)
  - cron: '0 6 * * *'
```

## Troubleshooting

### Images not generating

1. Check GitHub Actions logs for errors
2. Verify API keys are set correctly in repository secrets
3. Ensure workflow has write permissions

### News not fetching

1. Check NewsAPI key is valid
2. Verify you haven't exceeded the 100 requests/day limit
3. Check the Actions logs for specific error messages

### Rate limit errors from Replicate

The script includes automatic rate limiting (12 seconds between requests). If you still hit limits, increase the `RATE_LIMIT_DELAY` value in `scripts/generate-daily-images.ts`.

## Pausing Daily Generation

To temporarily pause:

1. Go to `.github/workflows/daily-images.yml`
2. Comment out or remove the `schedule` trigger
3. Commit the change

To resume, uncomment the schedule trigger.

## Stopping Permanently

To remove this feature:

1. Delete `.github/workflows/daily-images.yml`
2. Remove secrets from GitHub repository settings
3. Optionally delete:
   - `scripts/generate-daily-images.ts`
   - `scripts/fetch-news.ts`
   - Daily image files from `public/images/themes/`
