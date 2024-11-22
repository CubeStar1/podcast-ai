"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import Link from "next/link"
import type { Quiz } from "@/lib/types"

interface QuizActionsProps {
  quiz: Quiz
}

export function QuizActions({ quiz }: QuizActionsProps) {
  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href={`/quiz/${quiz.id}`}>
        <FileText className="h-4 w-4" />
      </Link>
    </Button>
  )
} 