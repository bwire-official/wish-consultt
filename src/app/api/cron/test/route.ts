import { NextRequest, NextResponse } from 'next/server'

// Test endpoint to verify GitHub Actions can reach the API
export async function GET(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || ''
    const isGitHubActions = userAgent.includes('GitHub-Actions') ||
                           request.headers.get('x-github-action') === 'scheduled-publisher'
    
    const now = new Date().toISOString()
    
    return NextResponse.json({
      message: 'Test endpoint working!',
      timestamp: now,
      userAgent: userAgent,
      isGitHubActions: isGitHubActions,
      headers: Object.fromEntries(request.headers.entries()),
      status: 'success'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 