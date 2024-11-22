'use client'

import { useState, useEffect } from 'react'
import { usePlaynoteGeneration } from '@/app/hooks/usePlaynoteGeneration'
import { usePlaynotes } from '@/app/hooks/usePlaynotes'
import { UploadSection } from '@/app/components/podcast/UploadSection'
import { PlaynotesList } from '@/app/components/podcast/PlaynotesList'
import { FloatingPlayer } from '@/app/components/podcast/FloatingPlayer'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import type { PlayNote } from '@/app/types/playnote'

export default function PodcastPage() {
  const { playnotes, loading: loadingPlaynotes, refetch } = usePlaynotes()
  const {
    file,
    setFile,
    loading,
    status,
    setStatus,
    playNoteId,
    setPlayNoteId,
    uploadAndGenerate,
    savePlaynote
  } = usePlaynoteGeneration()
  const [currentPlayNote, setCurrentPlayNote] = useState<PlayNote | null>(null)
  const [progress, setProgress] = useState(0)

  // Check for in-progress generations on mount
  useEffect(() => {
    const checkInProgressGenerations = async () => {
      try {
        const response = await fetch('/api/playnotes/in-progress')
        if (!response.ok) return
        
        const { inProgress } = await response.json()
        if (inProgress?.id) {
          setPlayNoteId(inProgress.id)
          setStatus('generating')
        }
      } catch (error) {
        console.error('Error checking in-progress generations:', error)
      }
    }

    checkInProgressGenerations()
  }, [setPlayNoteId, setStatus])

  // Poll for status only when we have a playNoteId AND status is 'generating'
  useEffect(() => {
    if (!playNoteId || status !== 'generating') return

    let retryTimeout: NodeJS.Timeout
    let failedAttempts = 0
    const MAX_RETRIES = 3

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/podcast-status/${playNoteId}`, {
          cache: 'no-store'
        })
        
        if (response.status === 429) {
          failedAttempts++
          if (failedAttempts <= MAX_RETRIES) {
            const delay = Math.min(1000 * Math.pow(2, failedAttempts), 30000)
            retryTimeout = setTimeout(checkStatus, delay)
            return false
          }
          return true
        }

        const data = await response.json()
        failedAttempts = 0

        if (data.status === 'completed') {
          setProgress(100)
          setStatus('completed')
          await savePlaynote(data)
          refetch()
          return true
        } else if (data.status === 'failed') {
          setStatus('failed')
          return true
        } else if (data.status === 'generating') {
          setProgress(prev => Math.min(prev + 10, 90))
        }
        return false
      } catch (error) {
        console.error('Status check error:', error)
        setStatus('failed')
        return true
      }
    }

    // Set up polling with initial check included in the interval
    const interval = setInterval(async () => {
      const shouldStop = await checkStatus()
      if (shouldStop) {
        clearInterval(interval)
      }
    }, 15000) // Check every 15 seconds

    // Cleanup
    return () => {
      clearInterval(interval)
      clearTimeout(retryTimeout)
    }
  }, [playNoteId, refetch, savePlaynote, status, setStatus])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setProgress(0) // Reset progress
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] overflow-hidden">
      <div className="h-full px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 max-w-screen-2xl mx-auto">
          <div className="space-y-4 min-w-0">
            <UploadSection
              file={file}
              loading={loading}
              onFileChange={handleFileChange}
              onUpload={uploadAndGenerate}
            />

            {(loading || status) && (
              <Card className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Processing Status</h2>
                    <div className="flex items-center gap-2">
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      <span className="text-sm text-muted-foreground capitalize">
                        {loading ? 'Uploading' : status}
                      </span>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {loading 
                      ? 'Uploading your file...'
                      : status === 'completed'
                      ? 'Podcast generated successfully!'
                      : status === 'generating'
                      ? 'Converting your content into a podcast...'
                      : 'Starting conversion...'}
                  </p>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4 h-full min-w-0">
            <Tabs defaultValue="file" className="w-full h-full">
              <TabsList className="w-full">
                <TabsTrigger value="file" className="flex-1">File</TabsTrigger>
                <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="mt-4 h-[calc(100%-48px)]">
                {!loadingPlaynotes && (
                  <PlaynotesList 
                    playnotes={playnotes} 
                    onPlay={setCurrentPlayNote}
                    onDelete={async (id) => {
                      // Implement delete functionality if needed
                    }}
                  />
                )}
              </TabsContent>
              <TabsContent value="transcript" className="mt-4">
                <Card className="p-4">
                  <p className="text-muted-foreground">
                    Transcript will be available after processing.
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <FloatingPlayer 
        playNote={currentPlayNote} 
        onClose={() => setCurrentPlayNote(null)} 
      />
    </div>
  )
} 