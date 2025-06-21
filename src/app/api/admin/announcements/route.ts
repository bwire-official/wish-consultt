import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Get the current user to check if they're an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('Auth check:', { user: user?.id, authError });
    
    if (authError || !user) {
      console.log('Authentication failed:', authError);
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('Profile check:', { profile, profileError });

    if (profileError || profile?.role !== 'admin') {
      console.log('Admin check failed:', { profileError, role: profile?.role });
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Fetch announcements from the database
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select(`
        id,
        title,
        content,
        status,
        priority,
        target_audience,
        created_at,
        scheduled_for,
        created_by,
        views,
        engagement_rate,
        tags
      `)
      .order('created_at', { ascending: false });

    console.log('Database query result:', { announcements, error });

    if (error) {
      console.error('Error fetching announcements:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch announcements',
        details: error.message 
      }, { status: 500 });
    }

    // Type guard for announcement
    function isAnnouncement(obj: unknown): obj is {
      id: number;
      title: string;
      content: string;
      status: string;
      priority?: string;
      target_audience?: string;
      created_at: string;
      scheduled_for?: string;
      created_by?: string;
      views?: number;
      engagement_rate?: number;
      tags?: string[];
    } {
      return (
        typeof obj === 'object' && obj !== null &&
        'id' in obj && typeof (obj as Record<string, unknown>).id === 'number' &&
        'title' in obj && typeof (obj as Record<string, unknown>).title === 'string' &&
        'content' in obj && typeof (obj as Record<string, unknown>).content === 'string' &&
        'status' in obj && typeof (obj as Record<string, unknown>).status === 'string' &&
        'created_at' in obj && typeof (obj as Record<string, unknown>).created_at === 'string'
      );
    }

    // Transform the data to match the frontend interface
    const transformedAnnouncements = Array.isArray(announcements)
      ? (announcements as unknown[]).filter(isAnnouncement).map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          body: announcement.content,
          status: announcement.status,
          priority: announcement.priority || 'medium',
          target_audience: announcement.target_audience || 'all',
          created_at: announcement.created_at,
          scheduled_for: announcement.scheduled_for,
          author: 'Admin', // We'll get the actual author name later
          views: announcement.views || 0,
          engagement_rate: announcement.engagement_rate || 0,
          tags: announcement.tags || []
        }))
      : [];

    console.log('Transformed announcements:', transformedAnnouncements);

    return NextResponse.json({ 
      announcements: transformedAnnouncements,
      success: true 
    });

  } catch (error) {
    console.error('Error in announcements API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 