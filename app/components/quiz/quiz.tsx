"use client"

import { useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Question } from "@/lib/schemas"

interface QuizProps {
  title: string
  questions: Question[]
  quizId: string
  clearPDF: () => void
}

interface QuestionResponse {
  questionIndex: number
  question: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

export default function Quiz({ title, questions, quizId, clearPDF }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<QuestionResponse[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const handleAnswer = async (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    const response: QuestionResponse = {
      questionIndex: currentQuestion,
      question: questions[currentQuestion].question,
      selectedAnswer,
      correctAnswer: questions[currentQuestion].correctAnswer,
      isCorrect
    }

    const newResponses = [...responses, response]
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate final score
      const correctAnswers = newResponses.filter(r => r.isCorrect).length
      const score = Math.round((correctAnswers / questions.length) * 100)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error("You must be logged in to save quiz results")
        router.push('/login')
        return
      }

      // Start a transaction to update both tables
      const { error: quizError } = await supabase
        .from('quizzes')
        .update({ score })
        .eq('id', quizId)

      if (quizError) {
        toast.error("Failed to update quiz score")
        console.error(quizError)
        return
      }

      // Save attempt to quiz_attempts
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quizId,
          user_id: user.id,
          score,
          question_responses: newResponses
        })

      if (attemptError) {
        toast.error("Failed to save quiz results")
        console.error(attemptError)
      } else {
        setShowResults(true)
        router.refresh() // Refresh the page to update the quiz list
      }
    }
  }

  if (showResults) {
    return (
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${
                  response.isCorrect 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-red-500/10 border border-red-500/20'
                }`}
              >
                <p className="font-medium mb-2">Question {index + 1}: {response.question}</p>
                <p>Your answer: {response.selectedAnswer}</p>
                {!response.isCorrect && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Correct answer: {response.correctAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-4">
            <Button onClick={() => router.push('/quiz')}>
              Back to Quizzes
            </Button>
            <Button variant="outline" onClick={clearPDF}>
              Create New Quiz
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          <p className="text-lg font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p>{questions[currentQuestion].question}</p>
          <div className="grid gap-2">
            {questions[currentQuestion].options.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="justify-start h-auto py-4 px-6"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
