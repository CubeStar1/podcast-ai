"use client"

import { useEffect, useState } from "react"
import { createSupabaseBrowser } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface QuizAttempt {
  id: string
  created_at: string
  score: number
  question_responses: {
    question: string
    selectedAnswer: string
    correctAnswer: string
    isCorrect: boolean
  }[]
}

export default function QuizDetails({ params }: { params: { id: string } }) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    async function fetchAttempts() {
      const { data } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', params.id)
        .order('created_at', { ascending: false })

      if (data) {
        setAttempts(data)
      }
    }

    fetchAttempts()
  }, [params.id, supabase])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Quiz Attempts</h1>
      <div className="space-y-6">
        {attempts.map((attempt) => (
          <Card key={attempt.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Score: {attempt.score}%
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(attempt.created_at))} ago
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {attempt.question_responses.map((response, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    response.isCorrect
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}
                >
                  <p className="font-medium mb-2">
                    Question {index + 1}: {response.question}
                  </p>
                  <p>Your answer: {response.selectedAnswer}</p>
                  {!response.isCorrect && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Correct answer: {response.correctAnswer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 