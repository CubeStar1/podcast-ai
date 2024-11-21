'use client'

import { useState } from 'react'
import { usePlaynoteGeneration } from '@/app/hooks/usePlaynoteGeneration'
import { usePlaynotes } from '@/app/hooks/usePlaynotes'
import { UploadSection } from '@/app/components/podcast/UploadSection'
import { PlaynotesList } from '@/app/components/podcast/PlaynotesList'
import { FloatingPlayer } from '@/app/components/podcast/FloatingPlayer'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PlayNote } from '@/app/types/playnote'

export default function PodcastPage() {
  const { playnotes, loading: loadingPlaynotes, refetch } = usePlaynotes()
  const {
    file,
    setFile,
    loading,
    status,
    uploadAndGenerate
  } = usePlaynoteGeneration()
  const [currentPlayNote, setCurrentPlayNote] = useState<PlayNote | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
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

            {status && (
              <Card className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Processing Status</h2>
                    <span className="text-sm text-muted-foreground capitalize">
                      {status}
                    </span>
                  </div>
                  <Progress value={status === 'completed' ? 100 : 50} />
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