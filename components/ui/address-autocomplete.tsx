'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MapPin } from 'lucide-react'

interface AddressResult {
  street: string
  city: string
  state: string
  zip: string
}

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  onSelect: (result: AddressResult) => void
  label?: string
}

interface NominatimResult {
  display_name: string
  address: {
    house_number?: string
    road?: string
    city?: string
    town?: string
    village?: string
    state?: string
    postcode?: string
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  label = 'Street Address *',
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<NodeJS.Timeout>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 4) {
      setSuggestions([])
      return
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q: query,
            format: 'json',
            addressdetails: '1',
            countrycodes: 'us',
            limit: '5',
          }),
        {
          headers: { 'User-Agent': 'AxisBid/1.0' },
        }
      )
      if (!res.ok) return
      const data: NominatimResult[] = await res.json()
      setSuggestions(data.filter((r) => r.address?.road))
      setShowDropdown(true)
      setActiveIndex(-1)
    } catch {
      // silently fail
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, fetchSuggestions])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (result: NominatimResult) => {
    const addr = result.address
    const street = [addr.house_number, addr.road].filter(Boolean).join(' ')
    const city = addr.city || addr.town || addr.village || ''
    const state = addr.state || ''
    const zip = addr.postcode || ''

    onChange(street)
    onSelect({ street, city, state, zip })
    setShowDropdown(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  const formatSuggestion = (result: NominatimResult) => {
    const addr = result.address
    const street = [addr.house_number, addr.road].filter(Boolean).join(' ')
    const city = addr.city || addr.town || addr.village || ''
    const state = addr.state || ''
    return { street, city, state }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <MapPin className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing an address..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-base transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue focus:ring-opacity-20 focus:outline-none"
          autoComplete="off"
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((result, idx) => {
            const { street, city, state } = formatSuggestion(result)
            return (
              <li
                key={idx}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  idx === activeIndex ? 'bg-brand-blue bg-opacity-10' : 'hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-gray-900 text-sm">{street}</p>
                <p className="text-xs text-gray-500">
                  {city}{city && state ? ', ' : ''}{state}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
