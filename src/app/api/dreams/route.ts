// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, unauthorizedResponse, getAuthenticatedUser, parseBody } from '@/lib/db/api-helpers';
import { createDream, listDreams } from '@/lib/db/queries';
import type { CreateDreamRequest } from '@/types';

/**
 * GET /api/dreams
 * List user's dreams with pagination and filtering
 */
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('page_size') || '20');
  const fromDate = searchParams.get('from_date') || undefined;
  const toDate = searchParams.get('to_date') || undefined;
  const sortBy = searchParams.get('sort_by') || 'dream_date';
  const sortOrder = (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc';

  const result = await listDreams(user.id, {
    page,
    page_size: Math.min(pageSize, 50), // cap at 50
    from_date: fromDate,
    to_date: toDate,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  if (result.error) {
    return errorResponse(result.error.message, 500);
  }

  return successResponse({
    dreams: result.data,
    total: result.total,
    page: result.page,
    page_size: result.page_size,
    has_more: result.has_more,
  });
}

/**
 * POST /api/dreams
 * Create a new dream record
 */
export async function POST(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { data: body, error: parseError } = await parseBody<CreateDreamRequest>(request);
  if (parseError) return parseError;

  if (!body?.dream_date) {
    return errorResponse('dream_date is required');
  }

  const { data, error: dbError } = await createDream(user.id, {
    dream_date: body.dream_date,
    raw_transcript: body.raw_transcript,
    capture_method: body.capture_method || null,
    audio_url: body.audio_url || null,
    wake_feeling: body.wake_feeling || null,
    alert_method: body.alert_method || null,
    lucid: body.lucid || false,
    nightmare: body.nightmare || false,
  });

  if (dbError) {
    console.error('Create dream error:', dbError);
    return errorResponse(dbError.message, 500);
  }

  return successResponse({ dream: data }, 201);
}