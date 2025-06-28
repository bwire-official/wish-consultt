import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    
    // Get the current user to check if they're an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const resolvedParams = await params;
    const announcementId = parseInt(resolvedParams.id);
    if (isNaN(announcementId)) {
      return NextResponse.json({ error: 'Invalid announcement ID' }, { status: 400 });
    }

    // Update the announcement status to published
    const { data, error } = await supabase
      .from('announcements')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', announcementId)
      .select()
      .single();

    if (error) {
      console.error('Error publishing announcement:', error);
      return NextResponse.json({ error: 'Failed to publish announcement' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Announcement published successfully',
      announcement: data
    });

  } catch (error) {
    console.error('Error in publish announcement API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 