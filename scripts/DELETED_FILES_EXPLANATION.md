# Deleted Files Explanation

These files were created during development/debugging and have been cleaned up:

## 🧪 **Test Files (Deleted)**
- **`test-notifications.js`** - Testing notification system creation
- **`test-debug.js`** - General debugging script  
- **`test-fix.js`** - Testing bug fixes
- **`test-promotion-notification.js`** - Testing admin promotion notifications
- **`test-promotion.js`** - Testing user role promotions
- **`test-user-search.js`** - Testing user search functionality
- **`test-env.js`** - Testing environment variable loading

## 🐛 **Debug Files (Deleted)**
- **`debug-users.js`** - Debugging user data issues
- **`debug-user.js`** - Debugging specific user problems

## 🔍 **Check Files (Deleted)**
- **`check-db.js`** - Database connectivity testing
- **`check-notifications.js`** - Notification system health check

## 🏗️ **Setup Files (Deleted)**
- **`create-profiles.js`** - Creating test user profiles
- **`create-test-user.js`** - Creating test users for development

## 📦 **Moved to `scripts/` Directory**
- **`schedule-publisher.js`** - Auto-publishes scheduled announcements (LOCAL ONLY)
- **`sync-auth-to-profiles.js`** - Syncs Supabase auth users to profiles table
- **`check.js`** - Basic database connectivity checker

## Why Were They Created?
During development, I created these files to:
- Debug database connection issues
- Test notification functionality
- Verify user creation and roles
- Test the announcement system
- Debug timezone issues
- Test environment variables

## Why Were They Deleted?
- **Cluttering codebase** - Not needed for production
- **Security risk** - Some contained hardcoded credentials
- **Temporary purpose** - Only needed during development
- **Better organized** - Useful ones moved to `scripts/` folder 