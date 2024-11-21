export type PlayNote = {
  id: string
  owner_id: string        // PlayNote's owner ID
  user_id: string         // Supabase auth user ID
  name: string
  source_file_url: string
  audio_url: string
  synthesis_style: string
  voice1: string
  voice2: string
  status: string
  duration: number
  requested_at: string
  created_at: string
  original_filename?: string
} 