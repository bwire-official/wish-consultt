# 📅 Announcement Scheduler Setup

## Overview
The announcement scheduling system allows admins to create announcements and schedule them for automatic publishing at specific dates and times.

## ✅ Frontend Implementation Status
- **Toggle Switch**: ✅ Complete
- **Date/Time Picker**: ✅ Complete  
- **Button Logic**: ✅ Complete (Draft/Publish hide when scheduling)
- **Form Validation**: ✅ Complete
- **Database Storage**: ✅ Complete

## 🤖 Backend Auto-Publishing Setup

### Option 1: Cron Job (Recommended)

Create a cron job to run every minute:

```bash
# Edit crontab
crontab -e

# Add this line to run every minute
* * * * * cd /path/to/your/project && node schedule-publisher.js >> scheduler.log 2>&1
```

### Option 2: GitHub Actions (for deployed apps)

Create `.github/workflows/scheduler.yml`:

```yaml
name: Announcement Scheduler

on:
  schedule:
    - cron: '* * * * *'  # Every minute

jobs:
  publish-announcements:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install @supabase/supabase-js
      - run: node schedule-publisher.js
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

### Option 3: Vercel Cron Jobs

Create `api/cron/publish-scheduled.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Your scheduling logic here
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  
  // Check and publish scheduled announcements
  // ... (same logic as schedule-publisher.js)
  
  res.status(200).json({ success: true })
}
```

Then configure in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/publish-scheduled",
      "schedule": "* * * * *"
    }
  ]
}
```

## 🧪 Testing the Scheduler

1. **Create a scheduled announcement** for 2-3 minutes in the future
2. **Check the database** to confirm it's saved with `status: 'scheduled'`
3. **Wait for the scheduled time** and verify it auto-publishes
4. **Check notifications** are created for target users

## 📋 Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔍 Monitoring

The scheduler logs all activities. Check logs for:
- ✅ Successful publications
- ❌ Errors during publishing
- 📊 Number of notifications created

## 🎯 How It Works

1. **Admin schedules announcement** → Saved as `status: 'scheduled'`
2. **Background job runs every minute** → Checks for `scheduled_for <= now()`
3. **Found scheduled announcements** → Updates `status: 'published'`
4. **Creates notifications** → Sends to target audience
5. **Success** → Announcement goes live automatically!

The UI is 100% complete and ready to use! 