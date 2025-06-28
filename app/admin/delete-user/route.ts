import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Ensure your Supabase service role key is stored securely in environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
// IMPORTANT: Add this new server-side environment variable
const adminDeletePassword = process.env.ADMIN_DELETE_PASSWORD; 

if (!supabaseUrl || !supabaseServiceRoleKey || !adminDeletePassword) {
    console.error('Missing required Supabase or admin password environment variables');
    // In a real app, you might want to return an error here if these are missing.
}

const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: Request) {
  try {
    const { userId, adminPassword } = await req.json(); // Receive password from the frontend

    if (!userId || !adminPassword) {
      return NextResponse.json({ error: 'User ID and admin password are required' }, { status: 400 });
    }

    // 1. Verify the admin password
    if (adminPassword !== adminDeletePassword) {
      // In a production environment, you should use a hashed password comparison (e.g., bcrypt).
      // This simple string comparison is for demonstration purposes.
      return NextResponse.json({ error: 'Incorrect admin password' }, { status: 403 });
    }

    // 2. Delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Supabase Auth Delete Error:', authError.message);
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }
    
    // The 'ON DELETE CASCADE' in our schema will automatically delete the user's
    // profile from public.users and other related tables (posts, comments, etc.).
    
    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}