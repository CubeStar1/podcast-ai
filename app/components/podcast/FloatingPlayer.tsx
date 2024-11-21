'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { PlayCircle, PauseCircle, Link2, Share2, X, Volume2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { PlayNote } from '@/app/types/playnote'

interface FloatingPlayerProps {
  playNote: PlayNote | null
  onClose: () => void
}

export function FloatingPlayer({ playNote, onClose }: FloatingPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress)
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0)
      })
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress)
      }
    }
  }, [playNote])

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const copyLink = async () => {
    if (playNote?.audio_url) {
      await navigator.clipboard.writeText(playNote.audio_url)
      toast({
        title: "Link copied",
        description: "Audio link has been copied to clipboard",
      })
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!playNote) return null

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-center">
      <Card className="w-full max-w-3xl bg-background/80 dark:bg-zinc-900/90 backdrop-blur-lg shadow-2xl border-border">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <audio ref={audioRef} src={playNote.audio_url} className="hidden" />
            
            <button onClick={togglePlay} className="text-primary">
              {isPlaying ? (
                <PauseCircle className="h-8 w-8 sm:h-10 sm:w-10" />
              ) : (
                <PlayCircle className="h-8 w-8 sm:h-10 sm:w-10" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-xs sm:text-sm truncate">{playNote.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={0.1}
                  className="flex-1"
                  onValueChange={([value]) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = value
                    }
                  }}
                />
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-1.5 sm:p-2 hover:bg-muted/80 rounded-full transition-colors">
                <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button 
                onClick={copyLink}
                className="p-1.5 sm:p-2 hover:bg-muted/80 rounded-full transition-colors"
              >
                <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button className="p-1.5 sm:p-2 hover:bg-muted/80 rounded-full transition-colors">
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-muted/80 rounded-full transition-colors"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 