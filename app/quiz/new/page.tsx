"use client"

import { useState, useEffect } from "react"
import { experimental_useObject } from "ai/react"
import { questionsSchema, type Questions } from "@/lib/schemas"
import { z } from "zod"
import { toast } from "sonner"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { FileUp, Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Quiz from "@/app/components/quiz/quiz"
import { Link } from "@/components/ui/link"

export default function NewQuiz() {
  const [files, setFiles] = useState<File[]>([])
  const [questions, setQuestions] = useState<Questions>([])
  const [isDragging, setIsDragging] = useState(false)
  const [title, setTitle] = useState<string>("")
  const [quizId, setQuizId] = useState<string>("")
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const {
    submit,
    object: partialQuestions,
    isLoading,
  } = experimental_useObject({
    api: "/api/generate-quiz",
    schema: questionsSchema,
    initialValue: undefined,
    onError: (error) => {
      toast.error("Failed to generate quiz. Please try again.")
      setFiles([])
    },
    onFinish: ({ object }) => {
      setQuestions(object ?? [])
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker.",
      )
      return
    }

    const selectedFiles = Array.from(e.target.files || [])
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    )

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.")
    }

    setFiles(validFiles)
  }

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const generateQuizTitle = async (fileName: string): Promise<string> => {
    // Remove file extension and convert to title case
    return fileName
      .replace(/\.[^/.]+$/, "")
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    )
    submit({ files: encodedFiles })
    const generatedTitle = await generateQuizTitle(encodedFiles[0].name)
    setTitle(generatedTitle)
  }

  // Save quiz to Supabase when questions are generated
  useEffect(() => {
    async function saveQuiz() {
      if (questions.length === 4 && title) {
        // First get the current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          toast.error("You must be logged in to create a quiz")
          router.push('/login') // Adjust this path to your auth page
          return
        }

        const { data, error } = await supabase
          .from('quizzes')
          .insert({
            title,
            questions,
            user_id: user.id  // Add the user_id to the insert
          })
          .select()
          .single()

        if (error) {
          toast.error("Failed to save quiz")
          console.error(error)
        } else {
          toast.success("Quiz saved successfully")
          setQuizId(data.id)
        }
      }
    }

    saveQuiz()
  }, [questions, title, supabase, router])

  const clearPDF = () => {
    setFiles([])
    setQuestions([])
    setTitle("")
    setQuizId("")
  }

  const progress = partialQuestions ? (partialQuestions.length / 4) * 100 : 0

  if (questions.length === 4) {
    if (!quizId) {
      return (
        <div className="container py-6">
          <Card className="p-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Saving quiz...</span>
            </div>
          </Card>
        </div>
      )
    }

    return (
      <Quiz 
        title={title} 
        questions={questions} 
        quizId={quizId}
        clearPDF={clearPDF} 
      />
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>)
      }}
    >
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Create New Quiz</h1>
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF</CardTitle>
            <CardDescription>
              Upload a PDF to generate an interactive quiz based on its content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitWithFiles} className="space-y-4">
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-muted-foreground/50`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <FileUp className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  {files.length > 0 ? (
                    <span className="font-medium text-foreground">
                      {files[0].name}
                    </span>
                  ) : (
                    <span>Drop your PDF here or click to browse.</span>
                  )}
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={files.length === 0 || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating Quiz...</span>
                  </span>
                ) : (
                  "Generate Quiz"
                )}
              </Button>
            </form>
          </CardContent>
          {isLoading && (
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full space-y-1">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
} 