import { createSupabaseServer } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"
import { QuizActions } from "@/app/components/quiz/quiz-actions"

interface Quiz {
  id: string
  title: string
  created_at: string
  questions: any[]
  score?: number
}

export default async function QuizHistory() {
  const supabase = createSupabaseServer()

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch quizzes on the server
  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Quizzes</h1>
        <Button asChild>
          <Link href="/quiz/new">
            <Plus className="mr-2 h-4 w-4" />
            New Quiz
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes?.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.title}</TableCell>
                <TableCell>
                  {new Date(quiz.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{quiz.questions.length}</TableCell>
                <TableCell>{quiz.score ?? "Not taken"}</TableCell>
                <TableCell>
                  <QuizActions quiz={quiz} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
