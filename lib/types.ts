export interface Quiz {
  id: string
  title: string
  created_at: string
  questions: any[]
  score?: number
  user_id: string
} 