# Daily Image Generation

This feature automatically generates daily hero images using monthly themed prompts.

## How It Works

1. Every day at 00:00 UTC, a GitHub Action runs
2. It generates two images (light and dark mode) based on the monthly themed prompts
3. Images are saved in the monthly folder with date-based naming: `YYYY-MM-DD-light.png` and `YYYY-MM-DD-dark.png`
4. The workflow commits and pushes the new images automatically

## Setup Instructions

### 1. Add Secrets to GitHub

Go to your repository settings → Secrets and variables → Actions → Repository secrets

Add the following secret:

- `REPLICATE_API_TOKEN`: Your Replicate API token

### 2. Configure Character Reference (Optional)

If you want to use a custom character reference image:

1. Go to Settings → Secrets and variables → Actions → Variables
2. Add a repository variable:
   - Name: `CHARACTER_REF`
   - Value: URL to your character reference image

If not set, it will use the default reference image from the repository.

### 3. Enable GitHub Actions

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

## Cost Considerations

- Replicate: ~$0.04 per image × 2 images/day = ~$2.40/month
- GitHub Actions: Free for public repos, 2000 minutes/month for private
- Storage: ~2MB/day × 365 days = ~730MB/year

## Customization

### Modify Prompt Style

Edit `src/config/prompts.ts` to customize:
- Monthly themed prompts for light/dark mode
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
   - Daily image files from `public/images/themes/`
