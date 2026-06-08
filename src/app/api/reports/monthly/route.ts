// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser } from '@/lib/db/api-helpers';
import { getMonthlyReport } from '@/lib/db/queries';

/**
 * GET /api/reports/monthly
 * Get monthly report data
 * Query params: year (required), month (required)
 */
export async function GET(request: NextRequest) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || '0');
  const month = parseInt(searchParams.get('month') || '0');

  if (!year || !month || month < 1 || month > 12) {
    return errorResponse('Valid year and month (1-12) query parameters are required');
  }

  const { data, error: dbError } = await getMonthlyReport(user.id, year, month);

  if (dbError && dbError.code !== 'PGRST116') {
    // PGRST116 = no rows returned (not an error for us)
    return errorResponse(dbError.message, 500);
  }

  if (!data) {
    return successResponse({
      report: null,
      message: 'No report available for this month yet. Reports are generated automatically.',
    });
  }

  return successResponse({ report: data });
}
