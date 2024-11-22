import { z } from "zod";

export const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.string()
});

export const questionsSchema = z.array(questionSchema);

export type Question = z.infer<typeof questionSchema>;
export type Questions = z.infer<typeof questionsSchema>;
