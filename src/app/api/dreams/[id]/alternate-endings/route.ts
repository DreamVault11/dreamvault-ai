// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser, parseBody, notFoundResponse } from '@/lib/db/api-helpers';
import { getDream } from '@/lib/db/queries';
import { generateAlternateEnding, generateAllEndings } from '@/lib/ai/alternate-endings';
import { getSupabaseAdmin } from '@/lib/db/supabase';

// Helper to build DreamReconstruction from dream record
function buildReconstruction(dream: Record<string, unknown>) {
  return {
    story: (dream.reconstructed_story as string) || (dream.raw_transcript as string) || '',
    summary: (dream.summary as string) || '',
    keySymbols: Array.isArray(dream.symbols) ? dream.symbols as string[] : [],
    emotionalThemes: Array.isArray(dream.emotions) ? dream.emotions as string[] : [],
    characters: Array.isArray(dream.characters)
      ? (dream.characters as string[]).map((c: string) => {
          const match = c.match(/^(.*?)\s*\((.*?)\):\s*(.*)$/);
          return match
            ? { name: match[1], role: match[2], description: match[3] }
            : { name: c, role: 'unknown', description: '' };
        })
      : [],
    locations: Array.isArray(dream.locations)
      ? (dream.locations as string[]).map((l: string) => {
          const match = l.match(/^(.*?):\s*(.*)$/);
          return match
            ? { name: match[1], description: match[2] }
            : { name: l, description: '' };
        })
      : [],
    timeline: [],
    sensoryDetails: Array.isArray(dream.sensory_details) ? dream.sensory_details as string[] : [],
    completenessScore: (dream.completeness_score as number) || 50,
    estimatedDuration: {
      min: (dream.dream_duration_min as number) || 15,
      max: (dream.dream_duration_max as number) || 30,
    },
  };
}

/**
 * POST /api/dreams/[id]/alternate-endings
 * Create alternate endings for a dream — either one specific type or all.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { id } = await params;

  // Verify dream belongs to user
  const { data: dream, error: dreamError } = await getDream(id, user.id);
  if (dreamError || !dream) {
    return notFoundResponse('Dream');
  }

  const originalStory = (dream.reconstructed_story as string) || (dream.raw_transcript as string) || '';

  const { data: body, error: parseError } = await parseBody<{
    ending_type?: string;
    custom_text?: string;
    generate_all?: boolean;
  }>(request);

  if (parseError) return parseError;

  const reconstruction = buildReconstruction(dream as any);

  let endings: any[] = [];
  let successCount = 0;

  if (body?.generate_all) {
    // Generate all 5 default ending types
    const result = await generateAllEndings(reconstruction, originalStory);
    if (!result.success || !result.data) {
      return errorResponse(result.error || 'Failed to generate alternate endings', 500);
    }
    endings = result.data;
    successCount = endings.length;
  } else {
    // Generate a single ending type
    const endingType = body?.ending_type;
    if (!endingType) {
      return errorResponse('ending_type or generate_all is required');
    }

    const validTypes = ['continue-dream', 'face-the-threat', 'explore-the-door', 'change-the-ending', 'ai-continue', 'write-custom'];
    if (!validTypes.includes(endingType)) {
      return errorResponse(`Invalid ending_type. Must be one of: ${validTypes.join(', ')}`);
    }

    const result = await generateAlternateEnding({
      dreamReconstruction: reconstruction,
      endingType: endingType as any,
      originalDream: originalStory,
      userWriting: body?.custom_text,
    });

    if (!result.success || !result.data) {
      return errorResponse(result.error || 'Failed to generate alternate ending', 500);
    }

    endings = [result.data];
    successCount = 1;
  }

  // Save alternate endings to database
  const supabase = getSupabaseAdmin();
  const savedEndings = [];

  for (const ending of endings) {
    const { data: saved, error: insertError } = await supabase
      .from('dream_alternate_endings')
      .insert({
        dream_id: id,
        ending_type: ending.type,
        generated_story: ending.narrative,
        movie_url: null,
      } as any)
      .select()
      .single();

    if (!insertError && saved) {
      savedEndings.push({
        id: saved.id,
        type: ending.type,
        title: ending.title,
        narrative: ending.narrative.substring(0, 300) + '...', // preview
        emotional_tone: ending.emotionalTone,
        key_changes: ending.keyChanges,
        scene_count: ending.sceneBreakdown?.length || 0,
      });
    }
  }

  if (savedEndings.length === 0) {
    return errorResponse('Failed to save any alternate endings to the database', 500);
  }

  return successResponse({
    message: `Generated ${savedEndings.length} alternate ending(s)`,
    dream_id: id,
    endings: savedEndings,
  }, 201);
}

/**
 * GET /api/dreams/[id]/alternate-endings
 * Get all alternate endings for a dream
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthenticatedUser(request);
  if (!user) return error;

  const { id } = await params;

  // Verify dream belongs to user
  const { data: dream, error: dreamError } = await getDream(id, user.id);
  if (dreamError || !dream) {
    return notFoundResponse('Dream');
  }

  const supabase = getSupabaseAdmin();
  const { data: endings, error: endingsError } = await supabase
    .from('dream_alternate_endings')
    .select('*')
    .eq('dream_id', id)
    .order('created_at', { ascending: true });

  if (endingsError) {
    return errorResponse(endingsError.message, 500);
  }

  return successResponse({ endings: endings || [] });
}