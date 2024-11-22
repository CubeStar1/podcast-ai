import { FileText, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface UploadSectionProps {
  file: File | null
  loading: boolean
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUpload: () => Promise<void>
}

export function UploadSection({ file, loading, onFileChange, onUpload }: UploadSectionProps) {
  return (
    <Card className="p-8 bg-black/5 dark:bg-white/5">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Convert PDF to Podcast</h1>
          <p className="text-muted-foreground mt-2">
            Upload your PDF and we&apos;ll convert it into an engaging podcast conversation.
          </p>
        </div>

        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept=".pdf"
            onChange={onFileChange}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-4"
          >
            <FileText className="h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <p className="font-medium">
                {file ? file.name : 'Drop your PDF here or click to upload'}
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF (up to 50MB)
              </p>
            </div>
          </label>
        </div>

        <Button
          onClick={onUpload}
          disabled={!file || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload & Convert
            </>
          )}
        </Button>
      </div>
    </Card>
  )
} 