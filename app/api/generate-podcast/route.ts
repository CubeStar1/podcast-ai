import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServer()
    const { pdfUrl } = await request.json()

    // Create the form data as a string with proper boundaries
    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
    let formBody = '';

    // Helper function to add form fields
    const addFormField = (name: string, value: string) => {
      formBody += `--${boundary}\r\n`;
      formBody += `Content-Disposition: form-data; name="${name}"\r\n\r\n`;
      formBody += `${value}\r\n`;
    };

    // Add all form fields
    addFormField('sourceFileUrl', pdfUrl);
    addFormField('synthesisStyle', 'podcast');
    addFormField('voice1', 's3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json');
    addFormField('voice1Name', 'Angelo');
    addFormField('voice2', 's3://voice-cloning-zero-shot/e040bd1b-f190-4bdb-83f0-75ef85b18f84/original/manifest.json');
    addFormField('voice2Name', 'Deedee');

    // Add closing boundary
    formBody += `--${boundary}--\r\n`;

    const response = await fetch("https://api.play.ai/api/v1/playnotes", {
      method: 'POST',
      headers: {
        'AUTHORIZATION': process.env.PLAYNOTE_API_KEY!,
        'X-USER-ID': process.env.PLAYNOTE_USER_ID!,
        'accept': 'application/json',
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formBody).toString()
      },
      body: formBody
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('PlayNote API Error:', errorText)
      throw new Error(`Failed to generate podcast: ${errorText}`)
    }

    const data = await response.json()
    console.log('PlayNote API Response:', data)

    return NextResponse.json({ 
      success: true, 
      playNoteId: data.id 
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 