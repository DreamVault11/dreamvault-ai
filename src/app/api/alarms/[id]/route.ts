// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser, parseBody } from '@/lib/db/api-helpers';
import { updateAlarm, deleteAlarm } from '@/lib/db/queries';
import type { UpdateAlarmRequest } from '@/types';

/**
 * PUT /api/alarms/[id]
 * Update an existing alarm
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { id } = await params;
  const { data: body, error: parseError } = await parseBody<UpdateAlarmRequest>(request);
  if (parseError) return parseError;

  if (!body || Object.keys(body).length === 0) {
    return errorResponse('No fields to update');
  }

  // Validate time if provided
  if (body.time) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(body.time)) {
      return errorResponse('Invalid time format. Use HH:mm (24-hour format)');
    }
  }

  // Validate days if provided
  if (body.days && body.days.length > 0) {
    const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const invalidDays = body.days.filter(d => !validDays.includes(d));
    if (invalidDays.length > 0) {
      return errorResponse(`Invalid day(s): ${invalidDays.join(', ')}`);
    }
  }

  const { data, error: dbError } = await updateAlarm(id, user.id, body as any);

  if (dbError) {
    return errorResponse(dbError.message, 500);
  }

  return successResponse({ alarm: data });
}

/**
 * DELETE /api/alarms/[id]
 * Delete an alarm
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { id } = await params;

  const { error: dbError } = await deleteAlarm(id, user.id);

  if (dbError) {
    return errorResponse(dbError.message, 500);
  }

  return successResponse({ deleted: true });
}
