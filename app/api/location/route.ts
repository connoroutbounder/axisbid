import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get('zip')

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Valid 5-digit zip code required' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`)
    if (!res.ok) {
      return NextResponse.json({ error: 'Zip code not found' }, { status: 404 })
    }

    const data = await res.json()
    const place = data.places?.[0]

    if (!place) {
      return NextResponse.json({ error: 'No location data found' }, { status: 404 })
    }

    return NextResponse.json({
      city: place['place name'],
      state: place['state abbreviation'],
      stateFull: place.state,
      zip: data['post code'],
    })
  } catch {
    return NextResponse.json({ error: 'Failed to look up location' }, { status: 500 })
  }
}
