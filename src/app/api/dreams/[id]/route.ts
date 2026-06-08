// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser, parseBody, notFoundResponse } from '@/lib/db/api-helpers';
import { getDream, updateDream } from '@/lib/db/queries';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import type { UpdateDreamRequest } from '@/types';

/**
 * GET /api/dreams/[id]
 * Get a single dream with full details including:
 * - Associated alternate endings
 * - Related universe entities
 * - Nearby dreams (before/after on timeline)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { id } = await params;

  // Get the main dream
  const { data: dream, error: dbError } = await getDream(id, user.id);
  if (dbError || !dream) {
    return notFoundResponse('Dream');
  }

  const supabase = getSupabaseAdmin();

  // 1. Get alternate endings for this dream
  const { data: alternateEndings } = await supabase
    .from('dream_alternate_endings')
    .select('*')
    .eq('dream_id', id)
    .order('created_at', { ascending: true });

  // 2. Find related universe entities based on dream's symbols, characters, locations
  const symbols = Array.isArray(dream.symbols) ? dream.symbols : [];
  const characters = Array.isArray(dream.characters) ? dream.characters : [];
  const locations = Array.isArray(dream.locations) ? dream.locations : [];

  // Extract names from character strings like "John (protagonist): description"
  const characterNames = characters.map((c: string) => c.split(' (')[0].trim());
  const locationNames = locations.map((l: string) => l.split(':')[0].trim());

  const searchTerms = [...symbols, ...characterNames, ...locationNames].filter(Boolean);

  let relatedEntities: any[] = [];
  if (searchTerms.length > 0) {
    // Search for entities matching any of the dream's symbols, characters, or locations
    const orConditions = searchTerms.map(
      (term: string) => `name.ilike.%${term.replace(/'/g, "''")}%`
    ).join(',');

    const { data: entities } = await supabase
      .from('dream_universe_entities')
      .select('*')
      .eq('user_id', user.id)
      .or(orConditions)
      .order('appearance_count', { ascending: false })
      .limit(10);

    relatedEntities = entities || [];
  }

  // 3. Get nearby dreams (before/after on timeline)
  const dreamDate = dream.dream_date;
  const { data: dreamsBefore } = await supabase
    .from('dreams')
    .select('id, dream_date, summary, completeness_score, movie_status, created_at')
    .eq('user_id', user.id)
    .lt('dream_date', dreamDate)
    .order('dream_date', { ascending: false })
    .limit(3);

  const { data: dreamsAfter } = await supabase
    .from('dreams')
    .select('id, dream_date, summary, completeness_score, movie_status, created_at')
    .eq('user_id', user.id)
    .gt('dream_date', dreamDate)
    .order('dream_date', { ascending: true })
    .limit(3);

  // 4. Get streak info
  const { data: streak } = await supabase
    .from('dream_streaks')
    .select('current_streak, longest_streak, total_dreams')
    .eq('user_id', user.id)
    .single();

  return successResponse({
    dream,
    alternateEndings: alternateEndings || [],
    relatedEntities,
    nearbyDreams: {
      before: dreamsBefore || [],
      after: dreamsAfter || [],
    },
    streak,
  });
}

/**
 * PUT /api/dreams/[id]
 * Update a dream (add AI results, movie URL, interpretations, etc.)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { id } = await params;
  const { data: body, error: parseError } = await parseBody<UpdateDreamRequest>(request);
  if (parseError) return parseError;

  if (!body || Object.keys(body).length === 0) {
    return errorResponse('No fields to update');
  }

  const { data, error: dbError } = await updateDream(id, user.id, body);
  if (dbError) {
    return errorResponse(dbError.message, 500);
  }

  return successResponse({ dream: data });
}