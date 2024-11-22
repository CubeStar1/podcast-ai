import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playNoteId = params.id
    const encodedId = encodeURIComponent(playNoteId)
    
    const url = `https://api.play.ai/api/v1/playnotes/${encodedId}`
    const headers = {
      'AUTHORIZATION': process.env.PLAYNOTE_API_KEY!,
      'X-USER-ID': process.env.PLAYNOTE_USER_ID!,
      'accept': 'application/json'
    }

    const response = await fetch(url, { 
      headers,
      cache: 'no-store'
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('PlayNote Status API Error:', errorText)
      throw new Error(`Failed to fetch podcast status: ${errorText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      id: data.id,
      ownerId: data.ownerId,
      name: data.name,
      sourceFileUrl: data.sourceFileUrls?.[0],
      audioUrl: data.audioUrl,
      synthesisStyle: data.synthesisStyle,
      voice1: data.voice1,
      voice2: data.voice2,
      status: data.status,
      duration: data.duration,
      requestedAt: data.requestedAt,
      createdAt: data.createdAt
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to check podcast status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 