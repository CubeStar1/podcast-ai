import { NextResponse } from 'next/server'

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

    const response = await fetch(url, { headers })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('PlayNote Status API Error:', errorText)
      throw new Error(`Failed to fetch podcast status: ${errorText}`)
    }

    const data = await response.json()
    console.log('data', data)
    return NextResponse.json({
      status: data.status,
      audioUrl: data.audioUrl,
      error: data.error,
      progress: data.progress // Some APIs provide progress information
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to check podcast status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 