import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { PlayNote } from '@/app/types/playnote'

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServer()
    const playNoteData = await request.json()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('playnotes')
      .upsert({
        ...playNoteData,
        user_id: user.id
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving playnote:', error)
    return NextResponse.json({ error: 'Failed to save playnote' }, { status: 500 })
  }
} 