// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser } from '@/lib/db/api-helpers';
import { getDreamAnalytics } from '@/lib/db/analytics';

/**
 * GET /api/analytics
 * Get dream patterns and analytics for the authenticated user
 */
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  try {
    const analytics = await getDreamAnalytics(user.id);
    return successResponse(analytics);
  } catch (err) {
    console.error('Analytics error:', err);
    return errorResponse('Failed to compute analytics', 500);
  }
}