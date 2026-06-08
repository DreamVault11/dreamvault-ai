// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, unauthorizedResponse, getAuthenticatedUser } from '@/lib/db/api-helpers';
import { listUniverseEntities } from '@/lib/db/queries';

/**
 * GET /api/universe
 * Get user's dream universe entities
 * Optional query param: type (character|location|symbol|storyline)
 */
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get('type') || undefined;

  const { data, error: dbError } = await listUniverseEntities(user.id, entityType);

  if (dbError) {
    return errorResponse(dbError.message, 500);
  }

  return successResponse({
    entities: data || [],
    total: data?.length || 0,
  });
}