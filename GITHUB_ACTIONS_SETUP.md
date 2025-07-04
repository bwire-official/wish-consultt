# GitHub Actions Setup for Scheduled Announcement Publisher

This guide explains how to set up GitHub Actions to trigger your Vercel endpoint every 5 minutes for publishing scheduled announcements.

## 🚀 Setup Instructions

### 1. Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `VERCEL_APP_URL`
5. Value: `https://your-app-name.vercel.app` (replace with your actual Vercel app URL)

### 2. Deploy Your Changes

Push the following files to your repository:
- `.github/workflows/scheduled-publisher.yml` (GitHub Actions workflow)
- Updated API route and middleware (already done)

### 3. Verify Setup

1. Go to **Actions** tab in your GitHub repository
2. You should see "Scheduled Announcement Publisher" workflow
3. It will run automatically every 5 minutes
4. You can also trigger it manually using the "Run workflow" button

## 🔧 How It Works

### GitHub Actions Workflow
- **Schedule**: Runs every 5 minutes using cron syntax `*/5 * * * *`
- **Action**: Makes a GET request to your Vercel endpoint
- **Security**: Uses custom headers to identify GitHub Actions requests
- **Monitoring**: Logs response status and body for debugging

### API Endpoint Security
- **Vercel Cron**: Still allowed (for future use)
- **GitHub Actions**: Allowed with proper headers
- **Unauthorized**: Blocked with 403 status

## 📊 Monitoring

### GitHub Actions Logs
- Check the **Actions** tab in your repository
- Each run shows detailed logs including:
  - Request timestamp
  - Response status code
  - Response body (number of announcements published)

### Vercel Function Logs
- Check your Vercel dashboard
- Go to **Functions** → **api/cron/publish-scheduled**
- View real-time logs of the function execution

## 🛠️ Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   - Check if `VERCEL_APP_URL` secret is set correctly
   - Verify the URL is accessible

2. **Workflow Not Running**
   - Check if the workflow file is in the correct location
   - Verify the cron syntax is correct

3. **API Endpoint Not Responding**
   - Check Vercel deployment status
   - Verify the endpoint is accessible via browser

### Manual Testing

You can test the endpoint manually:
```bash
curl -H "User-Agent: GitHub-Actions-Scheduled-Publisher/1.0" \
     -H "X-GitHub-Action: scheduled-publisher" \
     https://your-app-name.vercel.app/api/cron/publish-scheduled
```

## ⚡ Benefits Over Vercel Cron

- **Free Plan**: No limitations on GitHub Actions
- **Reliability**: More consistent execution
- **Monitoring**: Better logging and debugging
- **Flexibility**: Easy to modify schedule or add conditions
- **Cost**: Completely free for public repositories

## 🔄 Schedule Options

You can modify the cron schedule in `.github/workflows/scheduled-publisher.yml`:

```yaml
schedule:
  - cron: '*/5 * * * *'    # Every 5 minutes
  - cron: '0 */1 * * *'    # Every hour
  - cron: '0 9 * * *'      # Daily at 9 AM
  - cron: '0 9 * * 1-5'    # Weekdays at 9 AM
```

## 🎯 Next Steps

1. **Deploy**: Push your changes to GitHub
2. **Test**: Trigger the workflow manually first
3. **Monitor**: Check logs for the first few runs
4. **Optimize**: Adjust schedule if needed

Your scheduled announcement publisher is now ready! 🎉 