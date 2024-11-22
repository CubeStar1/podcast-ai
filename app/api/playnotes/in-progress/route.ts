import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createSupabaseServer()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('playnotes')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'generating')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is the "no rows returned" error

    return NextResponse.json({ inProgress: data || null })
  } catch (error) {
    console.error('Error fetching in-progress playnotes:', error)
    return NextResponse.json({ error: 'Failed to fetch in-progress playnotes' }, { status: 500 })
  }
} 