// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser, notFoundResponse } from '@/lib/db/api-helpers';
import { getDream, updateDream } from '@/lib/db/queries';
import { reconstructDream } from '@/lib/ai/dream-reconstruction';
import { interpretDream } from '@/lib/ai/interpretation';

/**
 * POST /api/dreams/[id]/reconstruct
 * Trigger AI reconstruction of a dream, then interpret it.
 * Saves results to the dream record.
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

  if (!dream.raw_transcript) {
    return errorResponse('Dream has no transcript to reconstruct. Record the dream first.');
  }

  // Step 1: Reconstruct the dream from raw transcript
  const reconstructionResult = await reconstructDream({
    rawTranscript: dream.raw_transcript,
  });

  if (!reconstructionResult.success || !reconstructionResult.data) {
    return errorResponse(
      reconstructionResult.error || 'AI reconstruction failed',
      500
    );
  }

  const recon = reconstructionResult.data;

  // Step 2: Interpret the reconstructed dream
  const interpretationResult = await interpretDream({
    dreamReconstruction: recon,
  });

  // Step 3: Save reconstruction + interpretation to the dream record
  const updates: Record<string, unknown> = {
    reconstructed_story: recon.story,
    summary: recon.summary,
    dream_duration_min: recon.estimatedDuration?.min ?? null,
    dream_duration_max: recon.estimatedDuration?.max ?? null,
    completeness_score: recon.completenessScore ?? null,
    symbols: recon.keySymbols || [],
    emotions: recon.emotionalThemes || [],
    characters: (recon.characters || []).map(c => `${c.name} (${c.role}): ${c.description}`),
    locations: (recon.locations || []).map(l => `${l.name}: ${l.description}`),
    sensory_details: recon.sensoryDetails || [],
    movie_status: 'pending',
  };

  if (interpretationResult.success && interpretationResult.data) {
    const interp = interpretationResult.data;
    updates.psychological_interpretation = interp.insights[0]?.content || null;
    updates.symbolic_interpretation = interp.insights[1]?.content || null;
    updates.archetypal_interpretation = interp.insights[2]?.content || null;
    updates.reflection_questions = interp.reflectionQuestions || [];
    updates.personal_insights = interp.personalPatternInsights?.join('\n') || null;
  }

  const { error: updateError } = await updateDream(id, user.id, updates);

  if (updateError) {
    console.error('Failed to save reconstruction:', updateError);
    return errorResponse('Reconstruction succeeded but failed to save. Please try again.', 500);
  }

  return successResponse({
    message: 'Dream reconstructed and interpreted successfully',
    dream_id: id,
    reconstruction: {
      summary: recon.summary,
      completeness_score: recon.completenessScore,
      estimated_duration: recon.estimatedDuration,
      symbols: recon.keySymbols,
      emotions: recon.emotionalThemes,
      characters: recon.characters,
      locations: recon.locations,
    },
    interpretation: interpretationResult.success ? {
      reflection_questions: interpretationResult.data?.reflectionQuestions,
      has_insights: true,
    } : null,
    token_usage: reconstructionResult.tokenUsage,
  });
}