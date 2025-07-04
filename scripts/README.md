# Scripts Directory

This directory contains utility scripts for development and maintenance.

## Scripts

### `schedule-publisher.js`
**Purpose**: Publishes scheduled announcements automatically  
**Usage**: `node scripts/schedule-publisher.js`  
**Environment**: Requires `.env` file with Supabase credentials  
**Note**: Only for local development. Production uses `/api/cron/publish-scheduled` endpoint  

### `sync-auth-to-profiles.js`
**Purpose**: Syncs authentication users to profiles table  
**Usage**: `node scripts/sync-auth-to-profiles.js`  
**Note**: Utility for database maintenance  

### `check.js`
**Purpose**: Debug script to check database connectivity and user data  
**Usage**: `node scripts/check.js`  
**Note**: Development/debugging only  

## Local vs Production

- **Local Development**: Use Windows Task Scheduler with `schedule-publisher.js`
- **Production (Hosted)**: Uses Vercel Cron Jobs calling `/api/cron/publish-scheduled`

## Setup

1. **Local**: Run `schtasks /create /sc minute /mo 1 /tn "AnnouncementPublisher" /tr "cmd /c cd /d D:\wish-consult && node scripts\schedule-publisher.js" /st 00:00`
2. **Production**: Deploy with `vercel.json` cron configuration 