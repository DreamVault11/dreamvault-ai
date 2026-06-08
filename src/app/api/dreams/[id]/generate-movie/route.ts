// @ts-nocheck - Supabase types need gen-types from live DB
import { NextRequest } from 'next/server';
import { successResponse, errorResponse, getAuthenticatedUser, parseBody, notFoundResponse } from '@/lib/db/api-helpers';
import { getDream, updateDream } from '@/lib/db/queries';
import { generateMovieStoryboard } from '@/lib/ai/movie-generation';

/**
 * POST /api/dreams/[id]/generate-movie
 * Trigger AI movie storyboard generation for a dream.
 * Requires reconstruction to have been completed first.
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

  if (!dream.reconstructed_story && !dream.raw_transcript) {
    return errorResponse('Dream needs to be reconstructed first before generating a movie.');
  }

  // Parse optional movie style and duration from body
  const { data: body } = await parseBody<{
    movie_style?: string;
    movie_duration_seconds?: number;
    aspect_ratio?: '9:16' | '16:9';
  }>(request);

  const movieStyle = (body?.movie_style || dream.movie_style || 'cinematic') as any;
  const aspectRatio = (body?.aspect_ratio || '9:16') as '9:16' | '16:9';

  // Validate movie style
  const validStyles = ['cinematic', 'fantasy', 'surreal', 'horror', 'sci-fi', 'animated', 'realistic'];
  if (!validStyles.includes(movieStyle)) {
    return errorResponse(`Invalid movie style. Must be one of: ${validStyles.join(', ')}`);
  }

  // Check subscription tier for free users (limit movie generations)
  // Premium check would go here
  // For MVP, we allow all users to generate

  // Build a DreamReconstruction from the stored dream data
  const dreamReconstruction = {
    story: dream.reconstructed_story || dream.raw_transcript || '',
    summary: dream.summary || '',
    keySymbols: Array.isArray(dream.symbols) ? dream.symbols : [],
    emotionalThemes: Array.isArray(dream.emotions) ? dream.emotions : [],
    characters: Array.isArray(dream.characters) 
      ? dream.characters.map((c: string) => {
          const match = c.match(/^(.*?)\s*\((.*?)\):\s*(.*)$/);
          return match 
            ? { name: match[1], role: match[2], description: match[3] }
            : { name: c, role: 'unknown', description: '' };
        })
      : [],
    locations: Array.isArray(dream.locations)
      ? dream.locations.map((l: string) => {
          const match = l.match(/^(.*?):\s*(.*)$/);
          return match 
            ? { name: match[1], description: match[2] }
            : { name: l, description: '' };
        })
      : [],
    timeline: [],
    sensoryDetails: Array.isArray(dream.sensory_details) ? dream.sensory_details : [],
    completenessScore: dream.completeness_score || 50,
    estimatedDuration: {
      min: dream.dream_duration_min || 15,
      max: dream.dream_duration_max || 30,
    },
  };

  // Generate movie storyboard via AI pipeline
  const storyboardResult = await generateMovieStoryboard({
    dreamReconstruction,
    style: movieStyle,
    aspectRatio,
  });

  if (!storyboardResult.success || !storyboardResult.data) {
    return errorResponse(
      storyboardResult.error || 'Movie generation failed',
      500
    );
  }

  const movieOutput = storyboardResult.data;

  // Save storyboard and movie metadata to the dream record
  const updates: Record<string, unknown> = {
    movie_style: movieStyle,
    movie_duration_seconds: movieOutput.totalDuration,
    movie_status: 'ready', // mark as ready — actual video rendering is async
    storyboard: movieOutput.storyboard.scenes.map((s: any) => ({
      scene_number: s.sceneNumber,
      description: s.description,
      visual_prompt: s.visualPrompt,
      duration_seconds: s.duration,
      camera_angle: s.cameraDirection,
      mood: s.mood,
    })),
    movie_prompts: movieOutput.storyboard.scenes.map((s: any) => s.visualPrompt),
  };

  const { error: updateError } = await updateDream(id, user.id, updates);

  if (updateError) {
    console.error('Failed to save movie storyboard:', updateError);
    return errorResponse('Movie generation succeeded but failed to save. Please try again.', 500);
  }

  return successResponse({
    message: 'Movie storyboard generated successfully',
    dream_id: id,
    movie: {
      title: movieOutput.title,
      tagline: movieOutput.tagline,
      style: movieOutput.style,
      aspect_ratio: movieOutput.aspectRatio,
      total_duration_seconds: movieOutput.totalDuration,
      scene_count: movieOutput.storyboard.scenes.length,
      narration_prompt: movieOutput.narrationPrompt,
    },
    token_usage: storyboardResult.tokenUsage,
  });
}