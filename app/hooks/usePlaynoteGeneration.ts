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
      // Upload to Supabase Storage
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
    status,
    setStatus,
    uploadAndGenerate
  }
} 