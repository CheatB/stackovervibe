import { NextRequest, NextResponse } from 'next/server'
import { getFeedPage } from '@/lib/payload'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get('type') || 'all'
  const sort = searchParams.get('sort') || 'new'
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20))

  const результат = await getFeedPage({ type, sort, page, limit })

  return NextResponse.json(результат)
}
