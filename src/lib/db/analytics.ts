// @ts-nocheck - Supabase types need gen-types from live DB
// Analytics query helpers
import { getSupabaseAdmin } from './supabase';
import type { AnalyticsResponse } from '@/types';

export async function getDreamAnalytics(userId: string): Promise<AnalyticsResponse> {
  const supabase = getSupabaseAdmin();

  // Get all dreams for the user
  const { data: dreams } = await supabase
    .from('dreams')
    .select('*')
    .eq('user_id', userId)
    .order('dream_date', { ascending: false });

  if (!dreams || dreams.length === 0) {
    return {
      total_dreams: 0,
      current_streak: 0,
      longest_streak: 0,
      top_emotions: [],
      top_symbols: [],
      top_characters: [],
      top_locations: [],
      dream_frequency: [],
      lucid_dreams_percentage: 0,
      nightmare_percentage: 0,
      movie_generations: 0,
    };
  }

  // Count all emotions across dreams
  const emotionCount = new Map<string, number>();
  const symbolCount = new Map<string, number>();
  const characterCount = new Map<string, number>();
  const locationCount = new Map<string, number>();
  const dateCount = new Map<string, number>();

  let lucidCount = 0;
  let nightmareCount = 0;
  let movieCount = 0;

  for (const dream of dreams) {
    // Emotions
    if (Array.isArray(dream.emotions)) {
      for (const emotion of dream.emotions) {
        emotionCount.set(emotion, (emotionCount.get(emotion) || 0) + 1);
      }
    }

    // Symbols
    if (Array.isArray(dream.symbols)) {
      for (const symbol of dream.symbols) {
        symbolCount.set(symbol, (symbolCount.get(symbol) || 0) + 1);
      }
    }

    // Characters
    if (Array.isArray(dream.characters)) {
      for (const character of dream.characters) {
        characterCount.set(character, (characterCount.get(character) || 0) + 1);
      }
    }

    // Locations
    if (Array.isArray(dream.locations)) {
      for (const location of dream.locations) {
        locationCount.set(location, (locationCount.get(location) || 0) + 1);
      }
    }

    // Frequency by date
    if (dream.dream_date) {
      dateCount.set(dream.dream_date, (dateCount.get(dream.dream_date) || 0) + 1);
    }

    if (dream.lucid) lucidCount++;
    if (dream.nightmare) nightmareCount++;
    if (dream.movie_status === 'ready') movieCount++;
  }

  // Get streak info
  const { data: streak } = await supabase
    .from('dream_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Convert maps to sorted arrays
  const topEmotions = Array.from(emotionCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topSymbols = Array.from(symbolCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topCharacters = Array.from(characterCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topLocations = Array.from(locationCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const dreamFrequency = Array.from(dateCount.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total_dreams: dreams.length,
    current_streak: streak?.current_streak || 0,
    longest_streak: streak?.longest_streak || 0,
    top_emotions: topEmotions,
    top_symbols: topSymbols,
    top_characters: topCharacters,
    top_locations: topLocations,
    dream_frequency: dreamFrequency,
    lucid_dreams_percentage: Math.round((lucidCount / dreams.length) * 100),
    nightmare_percentage: Math.round((nightmareCount / dreams.length) * 100),
    movie_generations: movieCount,
  };
}
