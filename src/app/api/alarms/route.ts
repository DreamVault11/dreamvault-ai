// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser, parseBody } from '@/lib/db/api-helpers';
import { listAlarms, createAlarm } from '@/lib/db/queries';
import type { CreateAlarmRequest } from '@/types';

/**
 * GET /api/alarms
 * List all alarms for the authenticated user
 */
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { data, error: dbError } = await listAlarms(user.id);

  if (dbError) {
    return errorResponse(dbError.message, 500);
  }

  return successResponse({ alarms: data || [] });
}

/**
 * POST /api/alarms
 * Create a new alarm
 */
export async function POST(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { data: body, error: parseError } = await parseBody<CreateAlarmRequest>(request);
  if (parseError) return parseError;

  if (!body?.title || !body?.time) {
    return errorResponse('title and time are required');
  }

  // Validate time format (HH:mm)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(body.time)) {
    return errorResponse('Invalid time format. Use HH:mm (24-hour format)');
  }

  // Validate days
  const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  if (body.days && body.days.length > 0) {
    const invalidDays = body.days.filter(d => !validDays.includes(d));
    if (invalidDays.length > 0) {
      return errorResponse(`Invalid day(s): ${invalidDays.join(', ')}. Valid days: ${validDays.join(', ')}`);
    }
  }

  const { data, error: dbError } = await createAlarm(user.id, {
    title: body.title,
    time: body.time,
    days: body.days || [],
    enabled: body.enabled ?? true,
    dream_recording_prompt: body.dream_recording_prompt ?? true,
    sound: body.sound,
  });

  if (dbError) {
    return errorResponse(dbError.message, 500);
  }

  return successResponse({ alarm: data }, 201);
}
