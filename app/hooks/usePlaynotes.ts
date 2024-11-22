import { useState, useEffect } from 'react'
import type { PlayNote } from '@/app/types/playnote'

export function usePlaynotes() {
  const [playnotes, setPlaynotes] = useState<PlayNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlaynotes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/playnotes')
      if (!response.ok) throw new Error('Failed to fetch playnotes')
      const data = await response.json()
      
      // Sort by creation date and put generating ones first
      const sortedData = data.sort((a: PlayNote, b: PlayNote) => {
        if (a.status === 'generating' && b.status !== 'generating') return -1
        if (a.status !== 'generating' && b.status === 'generating') return 1
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
      
      setPlaynotes(sortedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playnotes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaynotes()
  }, [])

  return { playnotes, loading, error, refetch: fetchPlaynotes }
} 