// @ts-nocheck - Supabase types need gen-types from live DB
// API response helpers
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function unauthorizedResponse() {
  return errorResponse('Unauthorized', 401);
}

export function notFoundResponse(resource = 'Resource') {
  return errorResponse(`${resource} not found`, 404);
}

// Get authenticated user from the request
export async function getAuthenticatedUser(request: Request) {
  const supabase = getSupabaseAdmin();

  // Get the authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { user: null, error: unauthorizedResponse() };
  }

  const token = authHeader.split('Bearer ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: unauthorizedResponse() };
  }

  return { user, error: null };
}

// Parse JSON body safely
export async function parseBody<T>(request: Request): Promise<{ data: T | null; error: Response | null }> {
  try {
    const data = await request.json() as T;
    return { data, error: null };
  } catch {
    return { data: null, error: errorResponse('Invalid JSON body') };
  }
}
