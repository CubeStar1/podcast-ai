# PodcastAI - Content to Audio Converter

PodcastAI transforms PDFs and text content into engaging podcast-style conversations using AI voices. Built with Next.js 14, Supabase, and the PlayNote API.

![PodcastAI Main Page](https://github.com/CubeStar1/podcast-ai/blob/master/public/podcasts-ai-logo.png)

## Core Features

- PDF to Podcast Conversion
- Document Summarization
- Interactive Document Querying
- Multi-Speaker Conversations

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database & Storage**: Supabase
- **Audio Generation**: PlayNote API
- **UI Components**: shadcn/ui

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/CubeStar1/podcast-ai.git
cd podcast-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_ADMIN=your_supabase_admin_key
PLAYNOTE_API_KEY=your_playnote_api_key
PLAYNOTE_USER_ID=your_playnote_user_id
```

4. Set up Supabase:
- Create a new Supabase project
- Run the SQL setup script from `supabase/schema.sql`
- Create a storage bucket named 'pdfs'

5. Run the development server:
```bash
npm run dev
```

## Project Structure

```
podcast-ai/
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript types
│   └── podcast/       # Podcast feature pages
├── public/            # Static assets
└── lib/              # Utility functions
```

## How It Works

1. **File Upload**
   - Users upload PDF files
   - Files are stored in Supabase storage
   - Public URLs are generated for processing

2. **Content Processing**
   - Content is analyzed and processed by AI
   - Multiple AI voices create dynamic conversations
   - Real-time status updates during generation

## PlayNote API Integration

The PlayNote API handles the AI voice generation with:
- Multiple voice options
- Natural conversation flow
- High-quality audio output
- Real-time processing status

## Acknowledgments

- [PlayNote API](https://play.ai) for AI voice generation
- [Supabase](https://supabase.com) for backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Next.js](https://nextjs.org) for the framework
