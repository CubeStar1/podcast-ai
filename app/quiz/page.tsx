"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

interface Quiz {
  id: string;
  title: string;
  created_at: string;
  questions: any[];
  score?: number;
}

export default function QuizHistory() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchQuizzes() {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setQuizzes(data);
      }
    }

    fetchQuizzes();
  }, [supabase]);

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
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell className="font-medium">{quiz.title}</TableCell>
                <TableCell>
                  {new Date(quiz.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{quiz.questions.length}</TableCell>
                <TableCell>{quiz.score ?? "Not taken"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/quiz/${quiz.id}`}>
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
