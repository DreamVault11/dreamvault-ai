// @ts-nocheck - Supabase types need gen-types from live DB
// DreamScape-specific database query helpers
import { getSupabaseAdmin } from './supabase';
import type { Dream, DreamStreak, DreamUniverseEntity, MonthlyReport, Alarm } from '@/types';

// ============ DREAMS ============

export async function createDream(userId: string, dreamData: Partial<Dream> & { dream_date: string }) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('dreams')
    .insert({
      user_id: userId,
      dream_date: dreamData.dream_date,
      raw_transcript: dreamData.raw_transcript || null,
      capture_method: dreamData.capture_method || null,
      audio_url: dreamData.audio_url || null,
      wake_feeling: dreamData.wake_feeling || null,
      alert_method: dreamData.alert_method || null,
      lucid: dreamData.lucid || false,
      nightmare: dreamData.nightmare || false,
    })
    .select()
    .single();

  if (data && !error) {
    await updateStreakOnDreamCreation(userId, dreamData.dream_date);
  }

  return { data, error };
}

export async function getDream(dreamId: string, userId: string) {
  const supabase = getSupabaseAdmin();
  return await supabase
    .from('dreams')
    .select('*')
    .eq('id', dreamId)
    .eq('user_id', userId)
    .single();
}

export async function listDreams(
  userId: string,
  options: {
    page?: number;
    page_size?: number;
    from_date?: string;
    to_date?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  } = {}
) {
  const supabase = getSupabaseAdmin();
  const page = options.page || 1;
  const pageSize = options.page_size || 20;
  const sortBy = options.sort_by || 'dream_date';
  const sortOrder = options.sort_order || 'desc';

  let query = supabase
    .from('dreams')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  if (options.from_date) {
    query = query.gte('dream_date', options.from_date);
  }
  if (options.to_date) {
    query = query.lte('dream_date', options.to_date);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(from, to);

  return {
    data: data || [],
    total: count || 0,
    page,
    page_size: pageSize,
    has_more: count ? from + pageSize < count : false,
    error,
  };
}

export async function updateDream(dreamId: string, userId: string, updates: Partial<Dream>) {
  const supabase = getSupabaseAdmin();
  return await supabase
    .from('dreams')
    .update(updates)
    .eq('id', dreamId)
    .eq('user_id', userId)
    .select()
    .single();
}

// ============ STREAKS ============

async function updateStreakOnDreamCreation(userId: string, dreamDate: string) {
  const supabase = getSupabaseAdmin();

  const { data: streak } = await supabase
    .from('dream_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  const dreamDay = new Date(dreamDate);

  if (streak) {
    const lastDay = streak.last_dream_date ? new Date(streak.last_dream_date) : null;
    const dayDiff = lastDay ? Math.round((dreamDay.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24)) : null;

    let newStreak = streak.current_streak;
    if (dayDiff === 1) {
      newStreak += 1;
    } else if (dayDiff === null || dayDiff > 1) {
      newStreak = 1;
    }

    await supabase
      .from('dream_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(streak.longest_streak, newStreak),
        last_dream_date: dreamDate,
        total_dreams: streak.total_dreams + 1,
      })
      .eq('user_id', userId);
  } else {
    await supabase
      .from('dream_streaks')
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_dream_date: dreamDate,
        total_dreams: 1,
      });
  }
}

export async function getDreamStreak(userId: string) {
  const supabase = getSupabaseAdmin();
  return await supabase
    .from('dream_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();
}

// ============ UNIVERSE ENTITIES ============

export async function listUniverseEntities(userId: string, entityType?: string) {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('dream_universe_entities')
    .select('*')
    .eq('user_id', userId);

  if (entityType) {
    query = query.eq('entity_type', entityType);
  }

  return await query.order('appearance_count', { ascending: false });
}

export async function upsertUniverseEntity(
  userId: string,
  entityType: string,
  name: string,
  description?: string
) {
  const supabase = getSupabaseAdmin();

  // Check if entity already exists
  const { data: existing } = await supabase
    .from('dream_universe_entities')
    .select('*')
    .eq('user_id', userId)
    .eq('entity_type', entityType)
    .eq('name', name)
    .single();

  if (existing) {
    return await supabase
      .from('dream_universe_entities')
      .update({
        appearance_count: existing.appearance_count + 1,
        last_appearance: new Date().toISOString(),
        description: description || existing.description,
      })
      .eq('id', existing.id)
      .select()
      .single();
  }

  return await supabase
    .from('dream_universe_entities')
    .insert({
      user_id: userId,
      entity_type: entityType,
      name,
      description: description || null,
      appearance_count: 1,
      first_appearance: new Date().toISOString(),
      last_appearance: new Date().toISOString(),
    })
    .select()
    .single();
}

// ============ MONTHLY REPORTS ============

export async function getMonthlyReport(userId: string, year: number, month: number) {
  const supabase = getSupabaseAdmin();
  return await supabase
    .from('monthly_reports')
    .select('*')
    .eq('user_id', userId)
    .eq('year', year)
    .eq('month', month)
    .single();
}

// ============ ALARMS ============

export async function createAlarm(userId: string, alarmData: {
  title: string;
  time: string;
  days: string[];
  enabled?: boolean;
  dream_recording_prompt?: boolean;
  sound?: string;
}) {
  const supabase = getSupabaseAdmin();
  return await supabase
    .from('alarms')
    .insert({
      user_id: userId,
      title: alarmData.title,
      time: alarmData.time,
      days: alarmData.days,
      enabled: alarmData.enabled ?? true,
      dream_recording_prompt: alarmData.dream_recording_prompt ?? true,
      sound: alarmData.sound || null,
    })
    .select()
    .single();
}

export async function listAlarms(userId: string) {
  const supabase = getSupabaseAdmin();
  return await supabase
    .from('alarms')
    .select('*')
    .eq('user_id', userId)
    .order('time', { ascending: true });
}

export async function updateAlarm(alarmId: string, userId: string, updates: Partial<Alarm>) {
  const supabase = getSupabaseAdmin();
  return await supabase
    .from('alarms')
    .update(updates)
    .eq('id', alarmId)
    .eq('user_id', userId)
    .select()
    .single();
}

export async function deleteAlarm(alarmId: string, userId: string) {
  const supabase = getSupabaseAdmin();
  return await supabase
    .from('alarms')
    .delete()
    .eq('id', alarmId)
    .eq('user_id', userId);
}
