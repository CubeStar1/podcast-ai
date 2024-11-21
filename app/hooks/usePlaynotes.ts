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
      setPlaynotes(data)
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