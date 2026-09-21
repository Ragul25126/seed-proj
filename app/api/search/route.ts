import { NextResponse } from 'next/server';
import { searchWebsiteContent } from '@/lib/search';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const results = await searchWebsiteContent(query);
    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('[SEED Search API] Error performing search:', error);
    return NextResponse.json(
      { error: 'Failed to process search request', results: [] },
      { status: 500 }
    );
  }
}
