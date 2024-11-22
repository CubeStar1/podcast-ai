import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createSupabaseBrowser } from '@/lib/supabase/client'

export function usePlaynoteGeneration() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [playNoteId, setPlayNoteId] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createSupabaseBrowser()

  const savePlaynote = async (playNoteData: any, initialSave = false) => {
    try {
      const response = await fetch('/api/playnotes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: playNoteData.id,
          owner_id: playNoteData.ownerId,
          name: playNoteData.name || file?.name,
          source_file_url: playNoteData.sourceFileUrl || playNoteData.sourceFileUrls?.[0],
          audio_url: playNoteData.audioUrl,
          synthesis_style: 'podcast',
          voice1: playNoteData.voice1,
          voice2: playNoteData.voice2,
          status: initialSave ? 'generating' : playNoteData.status,
          duration: playNoteData.duration,
          requested_at: playNoteData.requestedAt,
          created_at: playNoteData.createdAt,
          original_filename: file?.name
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save playnote')
      }
    } catch (error) {
      console.error('Error saving playnote:', error)
      throw error
    }
  }

  const uploadAndGenerate = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const fileName = `${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName)

      const response = await fetch('/api/generate-podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl: publicUrl }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      // Save initial state to database with the response data
      await savePlaynote({
        id: data.playNoteId,
        ownerId: data.ownerId,
        name: data.name,
        sourceFileUrls: [publicUrl],
        voice1: data.voice1,
        voice2: data.voice2,
        requestedAt: data.requestedAt,
        status: 'generating'
      }, true)

      setPlayNoteId(data.playNoteId)
      toast({
        title: 'Processing Started',
        description: 'Your podcast is being generated. This may take a few minutes.',
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to process your request',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    file,
    setFile,
    loading,
    playNoteId,
    setPlayNoteId,
    status,
    setStatus,
    uploadAndGenerate,
    savePlaynote
  }
} 