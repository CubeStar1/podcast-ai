import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayCircle, FileText, MoreHorizontal, Link, Trash } from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast'
import type { PlayNote } from '@/app/types/playnote'

interface PlaynotesListProps {
  playnotes: PlayNote[]
  onPlay: (playnote: PlayNote) => void
  onDelete?: (id: string) => Promise<void>
}

export function PlaynotesList({ playnotes, onPlay, onDelete }: PlaynotesListProps) {
  const { toast } = useToast()

  const copyLink = async (audioUrl: string) => {
    await navigator.clipboard.writeText(audioUrl)
    toast({
      title: "Link copied",
      description: "Audio link has been copied to clipboard",
    })
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
      <h2 className="text-xl font-bold sticky top-0 bg-background py-2">Your PlayNotes</h2>
      <div className="space-y-2">
        {playnotes.map((note) => (
          <Card key={note.id} className="p-3 sm:p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="bg-primary/10 p-2 sm:p-3 rounded-lg shrink-0">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate text-sm sm:text-base">
                  {note.name || note.original_filename}
                </h3>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{Math.round(note.duration / 60)} mins</span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                  onClick={() => onPlay(note)}
                >
                  <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                    >
                      <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => note.audio_url && copyLink(note.audio_url)}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    {onDelete && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(note.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 