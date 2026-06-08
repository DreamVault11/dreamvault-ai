// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/callback
 * Handles Supabase Auth redirect callbacks
 * The auth code is exchanged for a session, then user is redirected
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, redirectTo } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Missing auth code' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    // Exchange the code for a session
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=authorization_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { success: false, error: errorData.error_description || 'Failed to exchange auth code' },
        { status: 401 }
      );
    }

    const session = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        session,
        redirectTo: redirectTo || '/',
      },
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/callback
 * Handle GET redirect from Supabase Auth (OAuth flow)
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=authorization_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const session = await response.json();
        // Return HTML that sets the session in localStorage and redirects
        return new NextResponse(
          `<!DOCTYPE html>
<html>
<head>
  <title>Redirecting...</title>
  <script>
    localStorage.setItem('supabase.auth.token', JSON.stringify(${JSON.stringify(session)}));
    window.location.href = '${next}';
  </script>
</head>
<body>
  <p>Signing you in...</p>
</body>
</html>`,
          {
            headers: { 'Content-Type': 'text/html' },
          }
        );
      }
    } catch (error) {
      console.error('Auth callback error:', error);
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
}
