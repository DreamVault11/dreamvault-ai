// Alarm system types

export type AlarmDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface CreateAlarmRequest {
  title: string;
  time: string; // HH:mm (24h format)
  days: AlarmDay[];
  enabled?: boolean;
  dream_recording_prompt?: boolean;
  sound?: string;
}

export interface UpdateAlarmRequest {
  title?: string;
  time?: string;
  days?: AlarmDay[];
  enabled?: boolean;
  dream_recording_prompt?: boolean;
  sound?: string;
}

export interface AlarmResponse {
  id: string;
  title: string;
  time: string;
  days: AlarmDay[];
  enabled: boolean;
  dream_recording_prompt: boolean;
  sound: string | null;
  created_at: string;
  updated_at: string;
}
